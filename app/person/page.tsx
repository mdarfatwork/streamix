import React from 'react'
import { Metadata } from 'next';
import axios from 'axios';
import PersonPage from '@/components/person/PersonPage';
import { auth } from '@clerk/nextjs/server';

interface PersonPageProps {
  searchParams: {
    id: string;
  };
}

const fetchData = async (url: string, contentName: string) => {
  try {
    const response = await axios.get(url, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_MOVIE_API_Read_Access_Token}`
      }
    })
    return response.data
  } catch (error: any) {
    console.error(error)
    console.error(`Error while Fetching the ${contentName} ${error.message}`)
    return null;
  }
}
const fetchContent = async (id: string) => {
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/person/${id}/combined_credits?language=en-US`, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_MOVIE_API_Read_Access_Token}`
      }
    })
    return response.data.cast
  } catch (error: any) {
    console.error(error)
    console.error(`Error while Fetching the Content ${error.message}`)
    return null;
  }
}

const Page = async ({ searchParams }: PersonPageProps) => {
  const { id } = searchParams;
  const { userId } : { userId: string | null } = auth();

  if (!id) return <div className='min-h-screen'>No ID provided</div>

  const personDetails = await fetchData(`https://api.themoviedb.org/3/person/${id}?language=en-US`, "person details")

  const personSocialMedia = await fetchData(`https://api.themoviedb.org/3/person/${id}/external_ids`, "person social media")

  const personContent = await fetchContent(id)

  return (
    <main className='w-full min-h-screen'>
      <PersonPage userId={userId} personDetails={personDetails} personContent={personContent} personSocialMedia={personSocialMedia} />
    </main>
  )
}

export default Page

export async function generateMetadata({ searchParams }: PersonPageProps): Promise<Metadata> {
  const { id } = searchParams;

  if (!id) {
    return {
      title: 'Streamix - Person Not Found',
      description: 'No person found with the provided ID on Streamix.',
    };
  }

  const personDetails = await fetchData(`https://api.themoviedb.org/3/person/${id}?language=en-US`, "person details");

  return {
    title: `${personDetails?.name || 'Person'} - Streamix`,
    description: personDetails?.biography
      ? `${personDetails.biography.slice(0, 150)}...`
      : 'Explore more about this person on Streamix, your source for movies and TV shows.',
  };
}