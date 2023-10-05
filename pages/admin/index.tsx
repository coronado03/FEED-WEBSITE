  import { firestore, auth } from '../../lib/firebase';
  import { serverTimestamp, query, collection, orderBy, getFirestore, setDoc, doc, Firestore } from 'firebase/firestore';
  import { useContext, useState } from 'react';
  import { useRouter } from 'next/router';
  import { useCollection } from 'react-firebase-hooks/firestore';
  import kebabCase from 'lodash.kebabcase';
  import toast from 'react-hot-toast';
  import AuthCheck from '../../components/AuthCheck';
  import PostFeed from '../../components/PostFeed';
  import { UserContext } from '../../lib/context';

  export default function AdminPostsPage ({ }) {
      return(
          <main>
              <AuthCheck>
                  <PostList />
                  <CreateNewPost />
              </AuthCheck>
          </main>
      )
  }


  function PostList() {
    if (!auth.currentUser) {
      return <p>Please log in to view posts</p>;
    }

      const ref = collection(getFirestore(), 'users', auth.currentUser.uid, 'posts')
      const postQuery = query(ref, orderBy('createdAt'))
    
      const [querySnapshot] = useCollection(postQuery);
    
      const posts = querySnapshot?.docs.map((doc) => doc.data());
    
      return (
        <>
          <div className='flex flex-col mt-5'>
            <h1 className='text-white text-4xl text-center'><strong>Manage your Posts</strong></h1>
            <PostFeed posts={posts} admin />
          </div>

        </>
      );
    }
    
    function CreateNewPost() {
      const router = useRouter();
      const { username } = useContext(UserContext);
      const [title, setTitle] = useState('');
    
      // Ensure slug is URL safe
      const slug = encodeURI(kebabCase(title));
    
      // Validate length
      const isValid = title.length > 3 && title.length < 100;
    
      // Create a new post in firestore
      const createPost = async (e) => {
        e.preventDefault();
        const uid = auth.currentUser.uid;
        const ref = doc(getFirestore(), 'users', uid, 'posts', slug);
    
        // Tip: give all fields a default value here
        const data = {
          title,
          slug,
          uid,
          username,
          published: false,
          content: '# hello world!',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          heartCount: 0,
        };
    
        await setDoc(ref, data);
    
        toast.success('Post created!');
    
        // Imperative navigation after doc is set
        router.push(`/admin/${slug}`);
      };
    
      return (
          <form className='text-white flex flex-col items-center self-center mt-5 gap-y-4' onSubmit={createPost}>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="The title of your Post..."
              className="text-white bg-[#18181A] hover:outline outline-offset-4 outline-1 text-xl rounded-md"
            />
            <button type="submit" disabled={!isValid} className="py-2 px-6 rounded-md underline hover:bg-black text-white  transition-all duration-500">
              Create New Post
            </button>
          </form>
      );
    }