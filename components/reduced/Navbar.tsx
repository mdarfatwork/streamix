"use client"
import Image from 'next/image'
import React from 'react'
import Link from 'next/link'
// import axios from 'axios'
import { useClerk, useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const { signOut } = useClerk();
  const { isSignedIn } = useAuth();
  const router = useRouter();
  // const handleClearDb = async ()=>{
  //   try {
  //     const res = await axios.post('/api/dbclear')
  //     console.log(res)
  //     console.log('Database cleared successfully')
  //   } catch (error) {
  //     console.error(`Error clearing database: ${error}`)
  //   }
  // }
  return (
    <div className="w-full bg-blue-500 py-3">
      <div className="w-11/12 sm:w-4/5 md:w-3/4 xl:w-2/3 2xl:w-3/5 mx-auto flex justify-between items-center">
      <span>
        <Link href="/">
          <Image priority={true} alt='logo' src="/Logo.svg" className='w-20 sm:w-28 md:w-36 lg:w-40' width={150} height={50} />
        </Link>
      </span>
      <ul className='flex gap-2 md:gap-3 items-center text-base md:text-lg xl:text-xl'>
        {isSignedIn ? (
          <li onClick={() => signOut({ redirectUrl: '/' })} className='cursor-pointer py-1 px-2 bg-blue-50 text-blue-500 font-medium rounded-md'>Sign out</li>
        ) :(
          <>
          <li className='cursor-pointer text-blue-50 font-medium'><Link href="/sign-up">Sign Up</Link></li>
          <li className='cursor-pointer py-1 px-2 bg-blue-50 text-blue-500 font-medium rounded-md'><Link href="/sign-in">Sign In</Link></li>
          </>
        )}
        {/* <li onClick={handleClearDb} className='cursor-pointer text-blue-50 font-medium'>Clear DB</li> */}
      </ul>
      </div>
    </div>
  )
}

export default Navbar