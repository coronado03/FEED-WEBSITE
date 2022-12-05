import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../lib/context";

export default function Navbar() {

    const { user, username } = useContext(UserContext)

    return (
        <nav className="flex align-items-center text-black shadow-lg h-16">
            <ul className="list-none flex flex-row justify-end items-center	w-screen">
                <li className="mr-auto ml-7"> 
                    <Link href='/'>
                        <button className="p-2 border font-bold text-2xl bg-white hover:bg-gray-900 hover:text-white rounded-md transition-colors duration-300">FEED</button>
                    </Link>
                </li>

                {username && (
                    <>
                    <div className="hidden lg:flex">
                        <li>
                            <Link href="/admin">
                                <button className="p-2 border text-sm bg-white hover:bg-gray-900 hover:text-white rounded-md transition-colors duration-300">Write Posts</button>
                            </Link>
                        </li>
                    </div>

                        <li className="ml-12">
                        <Link href={`/${username}`}>
                                <img className="rounded-full w-1/2 hover:brightness-125 transition-all duration-200 ease-out" src= {user?.photoURL} />
                            </Link>
                        </li>
                    </>
                )}

                
                {!username && (
                    <>
                    <li className="mr-7">
                    <Link href="/enter">
                      <button className="py-3 px-6 rounded rounded-md hover:underline hover:bg-black text-white  transition-all duration-500">Log in</button>
                    </Link>
                  </li>
                  </>
                )}



            </ul>


        </nav>
    )


}
    
