import React from 'react'
import { currentUser } from '@clerk/nextjs/server'

const Page = async () => {
  const user = await currentUser()
  return (
    <section className='min-h-screen'>
      <div>Hello {user?.firstName} {user?.lastName}</div>
    </section>
  )
}

export default Page;