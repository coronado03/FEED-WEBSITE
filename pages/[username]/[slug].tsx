import { UserContext } from '../../lib/context';
import { firestore, getUserWithUsername, postToJson } from '../../lib/firebase';
import { doc, getDocs, getDoc, collectionGroup, query, limit, getFirestore } from 'firebase/firestore';

import Link from 'next/link';

import { useContext } from 'react';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import PostContent from '../../components/PostContent';
import HeartButton from '../../components/HeartButton';
import AuthCheck from '../../components/AuthCheck';


export async function getStaticProps({ params }) {
  const { username, slug } = params;
  const userDoc = await getUserWithUsername(username);

  let post;
  let path;

  if (userDoc) {
    // const postRef = userDoc.ref.collection('posts').doc(slug);
    const postRef = doc(getFirestore(), userDoc.ref.path, 'posts', slug);

    // post = postToJSON(await postRef.get());
    post = postToJson(await getDoc(postRef) );

    path = postRef.path;
  }

  return {
    props: { post, path },
    revalidate: 100,
  };
}

export async function getStaticPaths() {
  // Improve my using Admin SDK to select empty docs
  const q = query(
    collectionGroup(getFirestore(), 'posts'),
    limit(20)
  )
  const snapshot = await getDocs(q);

  const paths = snapshot.docs.map((doc) => {
    const { slug, username } = doc.data();
    return {
      params: { username, slug },
    };
  });

  return {
    // must be in this format:
    // paths: [
    //   { params: { username, slug }}
    // ],
    paths,
    fallback: 'blocking',
  };
}

export default function Post(props) {
  const postRef = doc(getFirestore(), props.path);
  const [realtimePost] = useDocumentData(postRef);

  const post = realtimePost || props.post;

  const { user: currentUser } = useContext(UserContext);

  return (
    <main className="text-white">      
      <section className='max-w-screen'>
        <PostContent post={post} />
      </section>

      <aside className="flex flex-col">
        <div className='flex flex-col w-10'>
          <p className='flex justify-center'>
            <strong>{post.heartCount || 0} </strong>
          </p>

          <AuthCheck
            fallback={
              <Link href="/enter">
                <button>💗 Sign Up</button>
              </Link>
            }
          >
            <HeartButton postRef={postRef} />
          </AuthCheck>
        </div>

        {currentUser?.uid === post.uid && (
          <Link href={`/admin/${post.slug}`}>
            <button className="self-center w-1/4 text-black p-2 border text-sm bg-white hover:bg-gray-900 hover:text-white rounded-md transition-colors duration-300">Edit Post</button>
          </Link>
        )}
      </aside>
    </main>
  );
}