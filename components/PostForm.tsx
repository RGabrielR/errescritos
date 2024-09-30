import { useFormik } from 'formik';
import * as Yup from 'yup';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useEditor } from '@tiptap/react';
import { extensions as builtInExtensions } from '@components/Tiptap/extensions';
import FixedMenu from '@components/Tiptap/FixedMenu';
import PasswordPrompt from '@components/PasswordPrompt';
import crypto from 'crypto';
import CloudinaryUploadWidget from './cloudinary/upload-widget-for-form';
import { Post } from 'interface/post';
const Editor = dynamic(() => import('./Tiptap/Editor'), { ssr: false });

interface PostFormProps {
  initialValues: {
    title: string;
    body: string;
    image: string;
    launchDate: string;
  };
  isEditMode: boolean;
  onSubmit: (values: Post, formikHelpers: any, hashedCredential: string, setShowPasswordPrompt: (show: boolean) => void) => void;
}

const PostForm = ({ initialValues, isEditMode, onSubmit }: PostFormProps) => {
  const [editorContent, setEditorContent] = useState(initialValues.body || '');
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(initialValues.image || null);
  
  const handleUploadSuccess = (url: string) => {
    formik.setFieldValue('image', url);
    setUploadedImageUrl(url);
  };

  const handleDeleteImage = () => {
    formik.setFieldValue('image', '');
    setUploadedImageUrl(null);
  };

  const editor = useEditor({
    extensions: [...builtInExtensions],
    content: initialValues.body,
    editable: true,
  });

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object({
      title: Yup.string().required('El título es requerido'),
      body: Yup.string().required('El cuerpo es requerido'),
      image: Yup.string().required('La imagen es requerida'),
      launchDate: Yup.date().required('La fecha de lanzamiento es requerida'),
    }),
    onSubmit: (values, formikHelpers) => {
      setShowPasswordPrompt(true);
    },
  });

  const handlePasswordSubmit = async (credential: string) => {
    const hashedCredential = crypto.createHash('sha256').update(credential).digest('hex');
    onSubmit(formik.values, { setSubmitting: formik.setSubmitting, resetForm: formik.resetForm }, hashedCredential, setShowPasswordPrompt);
  };

  const handleContentChange = (content: string) => {
    setEditorContent(content);
    formik.setFieldValue('body', content, false);
  };
console.log('formik values', formik.values);
  return (
    <>
      {showPasswordPrompt && (
        <PasswordPrompt onSubmit={handlePasswordSubmit} />
      )}

      <form onSubmit={formik.handleSubmit} className="flex flex-col space-y-4">
        <label className="flex flex-col">
          Título
          <input
            type="text"
            name="title"
            onChange={formik.handleChange}
            value={formik.values.title}
            className="p-2 border-2 border-gray-300 rounded-md"
          />
          {formik.touched.title && formik.errors.title && (
            <div className="text-red-500">{formik.errors.title}</div>
          )}
        </label>

        <label className="flex flex-col">Cuerpo</label>
        {editor && <FixedMenu editor={editor} className='z-10' />}
        <Editor
          editor={editor}
          content={editorContent}
          onContentChange={handleContentChange}
          placeholder="Start writing here..."
        />
        {formik.touched.body && formik.errors.body && (
          <div className="text-red-500">{formik.errors.body}</div>
        )}

        <div className='flex flex-row justify-around items-stretch'>
          <label className="flex flex-col text-lg">Imagen de fondo</label>
          <CloudinaryUploadWidget onUploadSuccess={handleUploadSuccess} />
        </div>

        {uploadedImageUrl && (
          <div className="relative max-w-96">
            <img src={uploadedImageUrl} alt="Uploaded image preview" className="max-w-96" />
            <button 
              type="button" 
              onClick={handleDeleteImage} 
              className="absolute top-3 right-10 bg-black text-white rounded-full py-1 px-3">
              X
            </button>
          </div>
        )}

        <label className="flex flex-col">
          Fecha de lanzamiento
          <input
            type="datetime-local"
            name="launchDate"
            onChange={formik.handleChange}
            value={formik.values.launchDate}
            className="p-2 border-2 border-gray-300 rounded-md"
          />
          {formik.touched.launchDate && formik.errors.launchDate && (
            <div className="text-red-500">{formik.errors.launchDate}</div>
          )}
        </label>

        <button
          type="submit"
          disabled={formik.isSubmitting }
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
        >
          {formik.isSubmitting ? 'Guardando...' : isEditMode ? 'Actualizar' : 'Crear'}
        </button>
      </form>
    </>
  );
};

export default PostForm;
