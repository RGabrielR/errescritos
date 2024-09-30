import React, { useEffect, useState, useRef } from "react";
import { Post } from "../../../interface/post";
import DOMPurify from "isomorphic-dompurify";
import BurguerMenu from "../../../components/BurguerMenu";
import { updateBlur } from "../../../utils/frontend/image";
import {fetchData} from "../../../utils/frontend/RESTlayer";
import { BackgroundImage } from "../../../components/BackgroundImage";
import { MainContent } from "../../../components/MainContent";
import { useRouter } from "next/router";
import crypto from "crypto";
const Home = () => {
  const [posts, setPosts] = useState([]);
  const [queryPost, setQueryPost] = useState({} as Post);
  const [isOpen, setIsOpen] = useState(false);
  const [blurValue, setBlurValue] = useState(5);
    let { id } = useRouter().query;
   id = id as string; 
  useEffect(() => {
    fetchData({ setPosts });
  }, []);

  useEffect( () => {
    if (posts.length > 0) {
      let queryPost = posts.find((post) => post.id == id);
      setQueryPost(queryPost);
      if (!queryPost) {
        let credential = window.prompt("Please enter your credential for authorization:");
        credential = crypto.createHash("sha256").update(credential).digest("hex");
        const encodedCredential = encodeURIComponent(credential);
        fetch(`/api/post?id=${id}`, {
          headers: {
            "X-API-KEY": encodedCredential,
          }
        }
        )
        .then((res) => res.json())
          .then((data) =>
          {
          setQueryPost(data.post);
        }).catch((err) => alert(err.message));
      }
      
    }
  }, [posts, id]);

    useEffect(() => {
    if (queryPost?.image) {
      updateBlur({ Post: queryPost, setBlurValue });
    }
  }, [queryPost?.image]);

  const sanitizedHTML = DOMPurify.sanitize(queryPost?.body);
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <BackgroundImage image={queryPost?.image || ''} blurValue={blurValue} />
      <BurguerMenu
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        posts={posts}
        id={parseInt(id)}
      >
        <MainContent sanitizedHTML={sanitizedHTML} title={queryPost?.title} />
      </BurguerMenu>
    </div>
  );
};

export default Home;
