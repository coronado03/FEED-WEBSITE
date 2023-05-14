import { collection, getDocs, getFirestore, limit, onSnapshot, query, where } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

export default function PostContent({ post }) {
  const db = getFirestore()
  const [profileUrl, setProfileUrl] = useState();
  
  useEffect(()=> {
    const getProfilePicture = async () => {
      try {
        const userRef = query(collection(db, "users"), where("username", "==", post.username), limit(1))
        const userSnap = await getDocs(userRef);

        if (userSnap?.docs[0]) {
          const userData = userSnap.docs[0].data()
          setProfileUrl(userData.photoURL)
        }
      }
  
      catch(error) {
        console.log(`An error has occured: ${error.name} ${error.message}`)
      }
    }


    getProfilePicture();
    console.log(profileUrl)
    
  }, [db, post.username, profileUrl])


  //console.log(post)
    const createdAt = typeof post?.createdAt === 'number' ? new Date(post.createdAt) : post.createdAt.toDate();


return (
    <div className="flex flex-col mt-5 w-11/12 mx-auto items-center">
      <div className="flex flex-row gap-x-3 self-start">
        <Image 
        width={40}
        height={30}
        className="rounded-full"
        src={profileUrl} 
        alt={post.username + 'profilePhoto'} />
        
        <div className="flex flex-col">
          <Link href={`/${post.username}/`}>
              <a className="text-info"><b>@{post.username}</b></a>
          </Link>{' '}
          <span className="text-sm text-neutral-400">
            Written by{' '}
            on {createdAt?.toDateString()}
          </span>
        </div>

      </div>

      <h1 className="text-4xl my-5"><strong>{post?.title}</strong></h1>

      <div className="w-5/6	md:text-lg">
        <ReactMarkdown>{post?.content}</ReactMarkdown>

      </div>
    </div>
  );
};