
import AuthCheck from '../../components/AuthCheck';
import { firestore, auth } from '../../lib/firebase';
import { serverTimestamp, doc, deleteDoc, updateDoc, getFirestore, getDoc } from 'firebase/firestore';
import ImageUploader from '../../components/ImageUploader';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { useDocumentDataOnce, useDocumentData } from 'react-firebase-hooks/firestore';
import { useForm } from 'react-hook-form';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';
import toast from 'react-hot-toast';


export default function AdminPostEdit(props) {
  return (
    <AuthCheck>
      <PostManager/>
    </AuthCheck>
  );
}

function PostManager() {
  const [preview, setPreview] = useState<boolean>(false);
  
  const router = useRouter();
  const { slug }: any  = router.query;

  const postRef = doc(getFirestore(), 'users', auth.currentUser.uid, 'posts', slug)
  const [post] = useDocumentData(postRef);



  
  return (
    <main className="grid md:grid-cols-6 text-white">
      {post && (
        <>
          <section className='col-span-5 flex flex-col items-center'>
            <h1 className='text-4xl'>{post.title}</h1>
            <p className='text-2xl'>ID: {post.slug}</p>

            <PostForm postRef={postRef} defaultValues={post} preview={preview} />
          </section>

          <aside className='flex flex-col'>
            <h3 className='text-center'>Tools</h3>
            <button onClick={() => setPreview(!preview)}>{preview ? 'Edit' : 'Preview'}</button>
            <Link href={`/${post.username}/${post.slug}`}>
              <button className="btn-blue">Live view</button>
            </Link>
            <DeletePostButton postRef={postRef} />
          </aside>
        </>
      )}
    </main>
  );
}

function PostForm({ defaultValues, postRef, preview }) {
  const { register, handleSubmit, formState, reset, watch, formState: { errors } } = useForm({ defaultValues, mode: 'onChange' });

  const { isValid, isDirty } = formState;

  const updatePost = async ({ content, published }) => {
    await updateDoc(postRef, {
      content,
      published,
      updatedAt: serverTimestamp(),
    });

    reset({ content, published });

    toast.success('Post updated successfully!');
  };

  return (
    <form className="w-full text-center" onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div className="flex flex-col">
          <ReactMarkdown>{watch('content')}</ReactMarkdown>
        </div>
      )}

      <div className={preview}>
        <ImageUploader />

        <textarea className='resize-none w-9/12 h-2/5	 text-white bg-[#242424] border border-[#262626] rounded'
          {...register("content", {
            maxLength: { value: 20000, message: 'content is too long' },
            minLength: { value: 10, message: 'content is too short' },
            required: { value: true, message: 'content is required' },
          })}
        ></textarea>

       

        <fieldset>
          <input className="" type="checkbox" {...register('published')} />
          <label>Published</label>
        </fieldset>

        <button type="submit" className="py-2 px-6 rounded-md underline hover:bg-black text-white  transition-all duration-500" disabled={!isDirty || !isValid}>
          Save Changes
        </button>
      </div>
    </form>
  );
}

function DeletePostButton({ postRef }) {
  const router = useRouter();

  const deletePost = async () => {
    const doIt = confirm('are you sure!');
    if (doIt) {
      await deleteDoc(postRef);
      router.push('/admin');
      toast('post annihilated ', { icon: '🗑️' });
    }
  };

  return (
    <button className="btn-red" onClick={deletePost}>
      Delete
    </button>
  );
}