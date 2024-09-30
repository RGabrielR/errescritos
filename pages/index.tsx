import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Post } from "../interface/post";
import { fetchData } from "@utils/frontend/RESTlayer";
const Home = () =>
{
  const [latestPost, setLatestPost] = useState({} as Post);
  const [posts, setPosts] = useState([] as Post[]);
  const router = useRouter();
  useEffect(() => {
    fetchData({ setPosts });
    if (posts.length > 0)
    {
      // set the latest post
      setLatestPost(posts[0]);
    }
  }, [posts]);
  // Redirect to the latest post when it is found
  useEffect(() => {
    if (latestPost.id) {
      router.push(`/post/${latestPost.id}`); // Redirect to the latest post's URL
    }
  }, [latestPost, router]);
  return ( "Cargando..." );
}
 
export default Home;