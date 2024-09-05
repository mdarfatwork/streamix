import React from 'react';
import Banner from '@/components/home/Banner';
import { auth } from '@clerk/nextjs/server';
import CardFlow from '@/components/movies/CardFlow';
import { Metadata } from 'next';
import Head from 'next/head';

export const metadata: Metadata = {
  title: 'Movies - Streamix',
  description: "Explore a world of cinema on Streamix. Browse, discover, and enjoy a vast collection of movies, from timeless classics to the latest blockbusters. Experience high-quality streaming with personalized recommendations just for you."
};

const Page = async () => {
  const { userId } : { userId: string | null } = auth();
  return (
    <>
    <Head>
      <link rel="preconnect" href="https://api.themoviedb.org" />
    </Head>
    <section className='min-h-screen'>
      <Banner contentType="movie" sliceLength={7} userId={userId} />
      <CardFlow contentType="movie" userId={userId} />
    </section>
    </>
  );
};

export default Page;