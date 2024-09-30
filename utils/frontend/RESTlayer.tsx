import { Post } from "interface/post";

export const fetchData = async ({ setPosts, allPosts = false }: { setPosts: (posts: Post[]) => void, allPosts?: boolean }) => {
    const res = await fetch(`/api/post?${allPosts ? "allPosts=true" : ""}`);
    const data = await res.json();
    setPosts(data.posts?.sort((a: Post, b: Post) => new Date(b.launchDate).getTime() - new Date(a.launchDate).getTime()));
};
  
export const deleteData = async (url: string, credential: string) =>
{
  const encodedCredential = encodeURIComponent(credential);
  const res = await fetch(url, { method: "DELETE", headers: { "x-api-key": encodedCredential } });
  const data = await res.json();
  return data;
};

export const postData = async (credential: string, post: Post) =>
{
  const encodedCredential = encodeURIComponent(credential);
  const res = await fetch('/api/post', { method: "POST", headers: { "x-api-key": encodedCredential }, body: JSON.stringify(post) });
  const data = await res.json();
  return data;
}

export const editData = async (url ,credential: string, post: Post) =>
{
  const encodedCredential = encodeURIComponent(credential);
  const res = await fetch(url, { method: "PUT", headers: { "x-api-key": encodedCredential }, body: JSON.stringify(post) });
  const data = await res.json();
  return data;
}