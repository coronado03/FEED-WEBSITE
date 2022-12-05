import { Timestamp, query, where, orderBy, limit, collectionGroup, getDocs, startAfter, getFirestore } from 'firebase/firestore';
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import Loader from "../components/Loader";
import PostFeed from "../components/PostFeed";
import { firestore, postToJson } from "../lib/firebase";

// Max post to query per page
const LIMIT = 10;

export async function getServerSideProps(context) {

  const ref = collectionGroup(firestore, 'posts');
  const postsQuery = query(
    ref,
    where('published', '==', true),
    orderBy('createdAt', 'desc'),
    limit(LIMIT),
  )

  const posts = (await getDocs(postsQuery)).docs.map(postToJson);
  return {
    props: { posts }, // will be passed to the page component as props
  };
}


export default function Home(props) {

  const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);

  const [postsEnd, setPostsEnd] = useState(false);

  const getMorePosts = async () => {
    setLoading(true);
    const last = posts[posts.length - 1];


    const cursor = typeof last.createdAt === 'number' ? Timestamp.fromMillis(last.createdAt) : last.createdAt;
    // const query = firestore
    //   .collectionGroup('posts')
    //   .where('published', '==', true)
    //   .orderBy('createdAt', 'desc')
    //   .startAfter(cursor)
    //   .limit(LIMIT);

      const ref = collectionGroup(firestore, 'posts');
      const postsQuery = query(
        ref,
        where('published', '==', true),
        orderBy('createdAt', 'desc'),
        startAfter(cursor),
        limit(LIMIT),
      )

    const newPosts = (await getDocs(postsQuery)).docs.map((doc) => doc.data());
    setPosts(posts.concat(newPosts));
    setLoading(false);

    if (newPosts.length < LIMIT) {
      setPostsEnd(true);
    }
  };


  return(
    <>
      <main className='flex flex-col mt-5'>

      <div className="card card-info text-white text-center">
        <h1 className='text-4xl'> <strong>POSTS</strong> </h1>

      </div>
     
      <PostFeed posts={posts} admin={true} />

      {!loading && !postsEnd && <button className='text-white bg-[#1A1A1C] p-5 mt-5' onClick={getMorePosts}>Load more</button>}

      <Loader show={loading} />

      {postsEnd && <p className='text-white text-center mt-4'>No more posts available!</p>}
    </main>
    </>
  )
}