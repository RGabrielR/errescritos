import { NextApiRequest, NextApiResponse } from "next";
import { Data } from "../../interface/post";
import {
  createPost,
  getPost,
  getPosts,
  updatePost,
  deletePost,
  getLatestPost,
  setScore,
} from "../../utils/backend/post";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "POST":
      if (req.query.setsScore === "true") return setScore(req, res);
      return createPost(req, res);
    case "GET":
      const { latestPost, id } = req.query;
      if (latestPost === "true") return getLatestPost(req, res);
      if (id) return getPost(req, res);
      return getPosts(req, res);
    case "PUT":
      return updatePost(req, res);
    case "DELETE":
      return deletePost(req, res);
    default:
      res.setHeader("Allow", ["GET", "POST", "PUT"]);
      res
        .status(405)
        .json({ success: false, message: `Method ${req.method} Not Allowed` });
  }
}

export const config = {
  api: {
    externalResolver: true,
  },
};
