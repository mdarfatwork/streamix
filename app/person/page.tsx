import React from 'react'

interface PersonPageProps {
    searchParams: {
      id: string;
    };
  }

const Page = async ({ searchParams }: PersonPageProps) => {
  const { id } = searchParams;

  if(!id) return <div className='min-h-screen'>No ID provided</div>
  return (
    <div className='min-h-screen'>
      <h2>Id is {id}</h2>
    </div>
  )
}

export default Page