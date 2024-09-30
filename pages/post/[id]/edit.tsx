import PostForm from '@components/PostForm';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { editData } from '@utils/frontend/RESTlayer';
const EditPost = () => {
  const router = useRouter();
  const { id } = router.query;
  const [initialValues, setInitialValues] = useState(null);

  useEffect(() => {
    if (id) {
      // Fetch post data based on ID
      fetch(`/api/post?id=${id}`, {
        headers: {
          "X-API-KEY": process.env.NEXT_PUBLIC_TOKEN_SECRET,
        }
      })
        .then(response => response.json())
          .then(data => { console.log('data', data); setInitialValues(data.post); })
        .catch(error => console.error('Error fetching post:', error));
    }
  }, [id]);

  const handleUpdate = async (values: any, { setSubmitting }: any, hashedCredential: string, setShowPasswordPrompt: (show: boolean) => void) =>
  {
    const editDataResponse = await editData(`/api/post?id=${id}`, hashedCredential, values);
    if (!editDataResponse.success) {  
      alert(editDataResponse.message);
      setSubmitting(false);
      setShowPasswordPrompt(false);
      return;
    }
    // Success message and navigation
    alert('Post editado correctamente');
    setSubmitting(false);
    router.push(`/post/${editDataResponse.post.id}`);

  };

  if (!initialValues) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <h1>Editar Post</h1>
      <PostForm initialValues={initialValues} isEditMode={true} onSubmit={handleUpdate} />
    </div>
  );
};

export default EditPost;
