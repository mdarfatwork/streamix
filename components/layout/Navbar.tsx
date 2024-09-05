"use client"
import Image from 'next/image'
import React from 'react'
import Link from 'next/link'
import { useAuth } from '@clerk/nextjs';
import { CgProfile } from "react-icons/cg";
import { motion } from "framer-motion";

const Navbar = () => {
  const { isSignedIn } = useAuth();

  return (
    <div className="w-full bg-blue-500 py-3">
      <div className="w-11/12 sm:w-4/5 md:w-3/4 xl:w-2/3 2xl:w-3/5 mx-auto flex justify-between items-center">
        <span>
          <Link href="/">
            <Image priority={true} alt='logo' src="/Logo.svg" className='w-20 sm:w-28 md:w-36 lg:w-40' width={150} height={50} />
          </Link>
        </span>
        {isSignedIn ? (
          <>
            <ul className='flex gap-2 md:gap-3 items-center text-sm md:text-base xl:text-lg 2xl:text-xl'>
              <Link href="/movies">
                <motion.li className='cursor-pointer py-1 px-1 md:px-2 bg-blue-50 text-blue-500 font-medium rounded-md' whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }}>Movies</motion.li>
              </Link>
              <Link href="/series">
                <motion.li className='cursor-pointer py-1 px-1 md:px-2 bg-blue-50 text-blue-500 font-medium rounded-md' whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }}>Series</motion.li>
              </Link>
            </ul>
            <span>
              <Link href="/profile">
                <motion.li className='cursor-pointer p-1 bg-blue-50 text-blue-500 font-medium rounded-full list-none' whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }}>
                  <CgProfile className='text-2xl md:text-3xl lg:text-4xl'/>  
                </motion.li>
              </Link>
            </span>
          </>
        ) : (
          <ul className='flex gap-2 md:gap-3 items-center text-base md:text-lg xl:text-xl'>
            <Link href="/sign-up">
              <li className='cursor-pointer text-blue-50 font-medium'>Sign Up</li>
            </Link>
            <Link href="/sign-in">
              <motion.li className='cursor-pointer py-1 px-2 bg-blue-50 text-blue-500 font-medium rounded-md' whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }}>Sign In</motion.li>
            </Link>
          </ul>
        )}
      </div>
    </div>
  )
}

export default Navbar