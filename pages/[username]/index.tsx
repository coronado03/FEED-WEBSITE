import { query, collection, getDocs, limit, orderBy, where } from "firebase/firestore";
import PostFeed from "../../components/PostFeed";
import UserProfile from "../../components/UserProfile";
import { firestore, getUserWithUsername, postToJson } from "../../lib/firebase";


export async function getServerSideProps({ query: urlQuery }) {
    const { username } = urlQuery;
    
    const userDoc = await getUserWithUsername(username);

    // ERROR HANDLING 
    if (!userDoc) {
        return {
          notFound: true,
        };
      }


    let user = null;
    let posts = null;

    if (userDoc) {
        user = userDoc.data();


        const postsQuery = query(
            collection(firestore, userDoc.ref.path, 'posts'),
            where('published', '==', true),
            orderBy('createdAt', 'desc'),
            limit(5)
          );
          posts = (await getDocs(postsQuery)).docs.map(postToJson);
        }
    

    return {
        props: { user, posts },
    };
}

export default function UserProfilePage({ user, posts }){
    return (
        <main className="flex flex-col justify-center">
            <UserProfile user={user} />
            <PostFeed posts={posts} admin={true} />
        </main>
    )
}