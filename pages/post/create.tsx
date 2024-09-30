import PostForm from '@components/PostForm';
import { postData } from '@utils/frontend/RESTlayer';
import router from 'next/router';

const CreatePost = () => {
  const handleCreate = async (values: any, { setSubmitting, resetForm }: any, hashedCredential: string, setShowPasswordPrompt: (show: boolean) => void) => {
       // // Try to post data using the hashed credential
    const postResponse = await postData(hashedCredential, values);
    if (!postResponse.success) {  
      alert(postResponse.message);
      setSubmitting(false);
      setShowPasswordPrompt(false);
      return;
    }
    // Success message and navigation
    alert('Post creado correctamente');
    setSubmitting(false);
    router.push(`/post/${postResponse.post.id}`);
  };

  return (
    <div>
      <h1>Crear Post</h1>
      <PostForm
        initialValues={{ title: '', body: '', image: '', launchDate: '' }}
        isEditMode={false}
        onSubmit={handleCreate}
      />
    </div>
  );
};

export default CreatePost;
