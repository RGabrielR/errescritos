import { useEffect, useState } from "react";
import { Post } from "../../interface/post";
import Link from "next/link";
import { fetchData, deleteData } from "../../utils/frontend/RESTlayer";
import PasswordPrompt from "@components/PasswordPrompt"; // Import PasswordPrompt
import crypto from "crypto";

export default function Table() {
  const [posts, setPosts] = useState([] as Post[]);
  const [postToDelete, setPostToDelete] = useState<number | null>(null); // Track which post to delete
  const [isPromptOpen, setIsPromptOpen] = useState(false); // Control the visibility of the prompt

  useEffect(() => {
    fetchData({ setPosts, allPosts: true });
  }, []);

  const handleDeleteRequest = (id: number) => {
    setPostToDelete(id); // Set the post ID to be deleted
    setIsPromptOpen(true); // Open the password prompt
  };

  const handleDelete = async (credential: string) => {
    if (postToDelete) {
      // Hash the credential
      const hashedCredential = crypto.createHash("sha256").update(credential).digest("hex");
      // Perform the delete request
      await deleteData(`/api/post?id=${postToDelete}`, hashedCredential).then((res) => {
        if (res.success)
        {
          alert(res.message);
          setPosts(posts.filter((post) => post.id !== postToDelete)); // Remove the deleted post
          setPostToDelete(null); // Reset post to delete
          setIsPromptOpen(false);
        } else
        {
          alert(res.message);
          setIsPromptOpen(false);
        }
      });
      
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">Posts</h1>

      <table className="table-auto w-full text-left border-collapse border border-gray-300 ">
        <thead className="bg-gray-100 text-black text-center">
          <tr>
            <th className="border border-gray-300 p-2">ID</th>
            <th className="border border-gray-300 p-2">Título</th>
            <th className="border border-gray-300 p-2">Imagen</th>
            <th className="border border-gray-300 p-2">Fecha de Lanzamiento</th>
            <th className="border border-gray-300 p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id} className="hover:bg-gray-600 transition-all duration-500 hover:text-black">
              <td className="border border-gray-300 p-2 text-center">{post.id}</td>
              <td className="border border-gray-300 p-2 cursor-default text-center">{post.title}</td>
              <td className="border border-gray-300 p-2 flex justify-center items-center">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-20 h-20 object-cover rounded"
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/no-image.png"; // Fallback image
                  }}
                />
              </td>
              <td className="border border-gray-300 p-2 text-center">
                {new Date(post.launchDate).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </td>
              <td className="border border-gray-300 p-2 text-center">
                <Link
                  href={`/post/${post.id}`}
                  className="text-blue-500 hover:text-blue-700 font-semibold"
                >
                  Ver
                </Link>
                <Link
                  href={`/post/${post.id}/edit`}
                  className="text-yellow-500 hover:text-yellow-700 font-semibold ml-4"
                >
                  Editar
                </Link>
                <button
                  className="text-red-500 hover:text-red-700 font-semibold ml-4"
                  onClick={() => handleDeleteRequest(post.id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {posts.length === 0 && (
        <div className="text-center py-4 text-gray-600">
          No hay posts disponibles.
        </div>
      )}

      {/* Show the password prompt if it's open */}
      {isPromptOpen && <PasswordPrompt onSubmit={handleDelete} />}
    </div>
  );
}
