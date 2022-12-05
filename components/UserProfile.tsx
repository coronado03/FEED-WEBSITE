
export default function UserProfile({ user }){
    return (
        <div className="mt-5 bg-[#28272A] w-11/12 h-52 rounded-lg self-center px-2 gap-3">
            <img className="w-24 md:w-32 rounded-full self-center mx-auto mt-[-24px] border border-[#18181A] border-8"  src={user.photoURL} />
            
            <div className="flex flex-col text-center">

                <h1 className="text-white text-4xl">{user.displayName}</h1>

                <p className="text-neutral-400  hover:underline underline-offset-2">
                    <i>@{user.username}</i>
                </p>


            </div>
                    </div>
    );
}