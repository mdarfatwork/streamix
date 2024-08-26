"use client"
import React from 'react'
import { useUser, useClerk } from '@clerk/nextjs'

const Page = () => {
  const { user } = useUser()
  const { signOut } = useClerk()
  return (
    <section className='min-h-screen'>
      <div>Hello {user?.firstName} {user?.lastName}</div>
      <button onClick={() => signOut({ redirectUrl: '/' })} >Sign Out</button>
    </section>
  )
}

export default Page;