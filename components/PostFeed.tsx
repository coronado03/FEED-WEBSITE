import Link from "next/link";

export default function PostFeed({ posts, admin }){
    return posts ? posts.map((post) => <PostItem post={post} key={post.slug} admin={admin} />) : null;
}


function PostItem({ post, admin = false }) {
    const wordCount = post?.content.trim().split(/\s+/g).length;
    const minutesToRead = (wordCount / 100 + 1).toFixed(0);

    return (
        <div className="flex flex-col gap-2 bg-[#28272A] text-[#E4E4E6] px-2 py-5 mt-3 rounded-lg w-11/12 self-center border-2d shadow-md shadow-zinc-800 border-zinc-50">
          <Link href={`/${post.username}`}>
            <a className="text-xs">
              <strong>By @{post.username}</strong>
            </a>
          </Link>
    
          <Link href={`/${post.username}/${post.slug}`}>
            <h2 className="text-2xl hover:text-neutral-400">
              <a>{post.title}</a>
            </h2>
          </Link>
    
          <footer className="flex flex-row gap-x-2 text-sm">
            <p>
              {wordCount} words.
            </p>
            <p>
              {minutesToRead} min read
            </p>
            <p className="">💗 {post.heartCount || 0} Hearts</p>
          </footer>
          
        </div>
    )

}
