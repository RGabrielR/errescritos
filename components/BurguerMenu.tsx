import React, { useRef } from "react";
import { Post } from "../interface/post";
import { BurguerMenuProps } from "../interface/props";
import Link from 'next/link';

const BurguerMenu: React.FC<BurguerMenuProps> = ({ isOpen, setIsOpen, posts, children, id }) => {
  const thamRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    const tham = thamRef.current;
    if (tham) {
      tham.classList.toggle("tham-active");
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      {/* Burger icon */}
      <div className="fixed right-3 top-6 z-30"  onClick={toggleMenu}>
        <div className="tham tham-e-arrow-alt tham-w-10" ref={thamRef}>
          <div className="tham-box bg-slate-500 rounded-sm p-7 -m-4">
            <div className="tham-inner bg-white -translate-x-5 translate-y-0" />
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-full md:w-1/4 lg:w-1/6 transform transition-transform duration-300 ease-in-out z-20 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Background with opacity */}
        <div className="absolute inset-0 bg-black  md:opacity-90"></div>

        {/* Sidebar content */}
        <div className="relative flex flex-col h-full justify-evenly items-center text-lg md:text-xl lg:text-2xl font-bold space-y-4 md:space-y-6 overflow-y-auto [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar]:translate-x-1
   [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-gray-800
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
          {posts.map((post: Post) => (
            <Link
              href={`/post/${post.id}`}
              key={post.id}
              className={`w-full text-center px-4 py-2 md:w-3/4 lg:w-1/2 ${
                id == post.id ? "text-gray-300 underline" : "text-white"
              }`}
            >
              <div>
                {/* Display post title and formatted launchDate */}
                <span className="block text-lg md:text-xl lg:text-2xl">{post.title}</span>
                <span className="block text-sm text-gray-400 mt-1">
                  {new Date(post.launchDate).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Main content (children) will resize based on sidebar */}
      <div
        className={`mt-3 ml-4 transition-all duration-300 ease-in-out ${
          isOpen ? "ml-52 md:ml-1/4 lg:ml-56" : "ml-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default BurguerMenu;
