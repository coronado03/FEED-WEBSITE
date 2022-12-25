import Link from "next/link";
import { Menu, Transition } from '@headlessui/react'
import { Fragment, useContext } from "react";
import { UserContext } from "../lib/context";
import { auth } from "../lib/firebase";


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

                        <li className="">
                            <Menu>
                                <Menu.Button>
                                    <img className="rounded-full w-1/2 hover:brightness-125 transition-all duration-200 ease-out" src= {user?.photoURL} /> 
                                 </Menu.Button>

                                 <Menu.Items className="absolute right-0 mt-2 w-44 origin-top-right divide-y text-white divide-[#28272A] rounded-md bg-[#1A1A1C] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <Menu.Item>
                                    <Link href={username}>

                                        <button className="group flex w-full items-center rounded-md px-2 py-2 text-center text-sm hover:bg-[#28272A] transition-colors duration-300">User Profile</button>
                                    </Link>
                                    </Menu.Item>
                                    <Menu.Item>
                                    <Link href="/admin">
                                        <button className="group flex w-full items-center rounded-md px-2 py-2 text-center text-sm hover:bg-[#28272A] transition-colors duration-300">Write Posts</button>
                                    </Link>
                                    </Menu.Item>
                                    <Menu.Item>
                                        <button className="group flex w-full items-center rounded-md px-2 py-2 text-center text-sm hover:bg-[#28272A] transition-colors duration-300" onClick={() => auth.signOut()}>Sign Out</button>
                                    </Menu.Item>
                                 </Menu.Items>
                                 
                            </Menu>
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
    