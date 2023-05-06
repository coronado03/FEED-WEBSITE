import { collection, getDocs, getFirestore, onSnapshot, query, where } from "firebase/firestore";
import Link from "next/link";
import ReactMarkdown from "react-markdown";


export default function PostContent({ post }) {
  const db = getFirestore()
  let getProfilePicture = async () => {
    const userRef = query(collection(db, "users"), where("username", "==", post.username))
    const querySnapshot = await getDocs(userRef);
    return querySnapshot;

  }



  //console.log(post)
    const createdAt = typeof post?.createdAt === 'number' ? new Date(post.createdAt) : post.createdAt.toDate();


return (
    <div className="flex flex-col mt-5 w-11/12 mx-auto items-center">
      <div className="flex flex-row gap-x-3 self-start">
        <img className="w-10 rounded-full"  src=""/>
        
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