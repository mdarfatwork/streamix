import React from 'react'
import MoviePage from '@/components/stream/MoviePage';
import { Metadata } from 'next';

interface WatchPageProps {
  searchParams: {
    movie?: string;
    series?: string;
  };
}

const Page = async ({ searchParams }: WatchPageProps) => {
  const { movie, series } = searchParams;

  if (movie) {
    return <MoviePage movieId={movie} />
  }

  if (series) {
    return <div>Streaming series with ID: {series}</div>
  }
  return (
    <div className='min-h-screen flex items-center justify-center'>No movie or series selected</div>
  )
}

export default Page


export const metadata: Metadata = {
  title: 'Streamix:',
  description: "Sign in to Streamix and dive back into your favorite movies and web series. Enjoy seamless access to your personalized content with a secure and user-friendly login experience. Log in now!"
};