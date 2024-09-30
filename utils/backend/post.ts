import { NextApiRequest, NextApiResponse } from "next";
import { kv } from "@vercel/kv";
import { Post, Data } from "../../interface/post";
import { checkCredential } from "./check-auth";

const convertToUnixTimestamp = (launchDate) => {
  const date = new Date(launchDate);
  return Math.floor(date.getTime() / 1000); // Return timestamp in seconds
};
export const createPost = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  try {
    const id = await kv.incr("post:counter");
    let { title, body, image, launchDate }: Post = req.body;
    const credential = req.headers["x-api-key"] as string;
    if (!credential) {
      res
        .status(400)
        .json({ success: false, message: "Credential is required" });
      return;
    }
    const correctCredential = await checkCredential(credential);
    if (!correctCredential) {
      res.status(401).json({ success: false, message: "Invalid credential" });
      return;
    }

    if (!title || !body || !image || !launchDate) {
      const postObject = JSON.parse(req.body);
      title = postObject.title;
      body = postObject.body;
      image = postObject.image;
      launchDate = postObject.launchDate;
    }
    await kv.hmset(`post:${id}`, {
      id: id.toString(),
      title,
      body,
      image,
      launchDate,
    });
    res.status(200).json({
      success: true,
      post: { id, title, body, image, launchDate },
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ success: false, message: "Failed to create post" });
  }
};

export const setScore = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const postKeys = await kv.keys("post:*");
    console.log("postKeys", postKeys);

    if (postKeys.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No posts found" });
    }

    // Iterate over all posts and process their launchDates
    for (const key of postKeys) {
      // Skip non-post keys like 'post:counter'
      if (key === "post:counter") {
        console.log(`Skipping key: ${key}`);
        continue; // Skip this iteration
      }

      const post = await kv.hgetall(key); // Get all fields for the post

      // If the post has a valid launchDate, convert it to a Unix timestamp
      if (post.launchDate) {
        const timestamp = convertToUnixTimestamp(post.launchDate);

        // Add the post to a sorted set with ZADD-like behavior in Upstash KV
        await kv.zadd("posts_by_date", {
          score: timestamp,
          member: key, // Store the post key in the sorted set
        });
      }
    }

    return res
      .status(200)
      .json({ success: true, message: "Scores set successfully for posts." });
  } catch (error) {
    console.error("Error setting scores for posts:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error setting scores for posts." });
  }
};

export const getPosts = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  try {
    const today = new Date().toISOString();
    const keys = await kv.keys("post:*");
    const posts: (Post & { id: number })[] = [];

    if (req.query.allPosts === "true") {
      for (const key of keys) {
        if (key !== "post:counter") {
          const fields = await kv.hgetall(key);
          const id = parseInt(fields.id as string, 10); // Ensure ID is a number
          const title = fields.title as string;
          const body = fields.body as string;
          const image = fields.image as string;
          const launchDate = fields.launchDate as string;

          // Ensure `launchDate` is a valid ISO string before creating a `Date` object
          if (id && title && body && launchDate) {
            const launchDateObj = new Date(launchDate);

            if (!isNaN(launchDateObj.getTime())) {
              posts.push({ id, title, body, image, launchDate });
            }
          }
        }
      }
    } else {
      for (const key of keys) {
        if (key !== "post:counter") {
          // exclude post:counter key
          const fields = await kv.hgetall(key);
          const id = parseInt(fields.id as string, 10); // Ensure ID is a number
          const title = fields.title as string;
          const body = fields.body as string;
          const image = fields.image as string;
          const launchDate = fields.launchDate as string;

          // Ensure `launchDate` is a valid ISO string before creating a `Date` object
          if (id && title && body && launchDate) {
            const launchDateObj = new Date(launchDate);

            if (
              !isNaN(launchDateObj.getTime()) &&
              launchDateObj.toISOString() < today
            ) {
              posts.push({ id, title, body, image, launchDate });
            }
          }
        }
      }
    }

    res.status(200).json({ success: true, posts });
  } catch (error) {
    console.error("Error getting posts:", error);
    res.status(500).json({ success: false, message: "Failed to get posts" });
  }
};

export const getPost = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const postId = req.query.id as string;
  if (!postId) {
    res.status(400).json({ success: false, message: "Post ID is required" });
    return;
  }
  const credential = req.headers["x-api-key"] as string;
  if (!credential) {
    res.status(400).json({ success: false, message: "Credential is required" });
    return;
  }
  const correctCredential = await checkCredential(credential);
  if (!correctCredential) {
    res.status(401).json({ success: false, message: "Invalid credential" });
    return;
  }
  try {
    const post = await kv.hgetall(`post:${postId}`);
    if (!post) {
      res.status(404).json({ success: false, message: "Post not found" });
      return;
    }

    const id = parseInt(post.id as unknown as string, 10);
    const title = post.title as string;
    const body = post.body as string;
    const image = post.image as string;
    const launchDate = post.launchDate as string;

    res
      .status(200)
      .json({ success: true, post: { id, title, body, image, launchDate } });
  } catch (error) {
    console.error("Error getting post:", error);
    res.status(500).json({ success: false, message: "Failed to get post" });
  }
};

export const getLatestPost = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  try {
    // Fetch the latest post key from the sorted set
    const latestPostKey = await kv.zrange("posts_by_date", -1, -1); // Get the last (latest) post

    // Check if no post key was returned
    if (!latestPostKey || latestPostKey.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No posts found" });
    }

    // Extract the first key (latest post key)
    const postKey = latestPostKey[0];

    // Log post key to check correctness
    console.log("Latest post key:", postKey);

    // Fetch all fields for the post using the key
    const post = await kv.hgetall(postKey as string);
    console.log("post", post);
    // Check if the post is valid and contains expected data
    if (!post || !post.id || !post.title || !post.body || !post.launchDate) {
      console.error("Post is missing required fields:", post);
      return res
        .status(404)
        .json({ success: false, message: "Invalid post data" });
    }

    // Parse post fields
    const id = post.id as number;
    const title = post.title as string;
    const body = post.body as string;
    const image = post.image as string;
    const launchDate = post.launchDate as string;

    // Return the post data
    res.status(200).json({
      success: true,
      post: { id, title, body, image, launchDate },
    });
  } catch (error) {
    console.error("Error getting latest post:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to get latest post" });
  }
};

export const updatePost = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const postId = req.query.id as string;
  if (!postId) {
    res.status(400).json({ success: false, message: "Post ID is required" });
    return;
  }

  let updatedPost = req.body;
  if (typeof updatedPost === "string") {
    updatedPost = JSON.parse(updatedPost);
  }

  if (!updatedPost) {
    res
      .status(400)
      .json({ success: false, message: "Updated post data is required" });
    return;
  }

  const credential = req.headers["x-api-key"] as string;
  if (!credential) {
    res.status(400).json({ success: false, message: "Credential is required" });
    return;
  }
  const correctCredential = await checkCredential(credential);
  if (!correctCredential) {
    res.status(401).json({ success: false, message: "Invalid credential" });
    return;
  }

  try {
    const existingPost = await kv.hgetall(`post:${postId}`);
    if (!existingPost) {
      res.status(404).json({ success: false, message: "Post not found" });
      return;
    }
    await kv.hmset(`post:${postId}`, updatedPost);
    res.status(200).json({ success: true, post: updatedPost });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ success: false, message: "Failed to update post" });
  }
};
export const deletePost = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  try {
    const postId = req.query.id as string;
    if (!postId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing post ID" });
    }
    const credential = req.headers["x-api-key"] as string;
    if (!credential) {
      res
        .status(400)
        .json({ success: false, message: "Credential is required" });
      return;
    }
    const correctCredential = await checkCredential(credential);
    if (!correctCredential) {
      res.status(401).json({ success: false, message: "Invalid credential" });
      return;
    }
    const existingPost = await kv.hgetall(`post:${postId}`);
    if (!existingPost) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    // Delete all fields for this post
    const keys = Object.keys(existingPost);
    await Promise.all(keys.map(async (key) => kv.hdel(`post:${postId}`, key)));
    res.status(200).json({ success: true, message: "Post deleted" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ success: false, message: "Failed to delete post" });
  }
};
