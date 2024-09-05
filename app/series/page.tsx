import React from 'react'
import { auth } from '@clerk/nextjs/server';
import Banner from '@/components/home/Banner';
import { Metadata } from 'next';
import CardFlow from '@/components/movies/CardFlow';
import Head from 'next/head';

export const metadata: Metadata = {
  title: 'Series - Streamix',
  description: "Immerse yourself in captivating TV series on Streamix. From binge-worthy dramas to thrilling adventures, discover and stream your favorite shows with ease. Enjoy tailored recommendations and never miss an episode."
};

const page = () => {
  const { userId } : { userId: string | null } = auth();
  return (
    <>
    <Head>
      <link rel="preconnect" href="https://api.themoviedb.org" />
    </Head>
    <section className='min-h-screen'>
      <Banner contentType="tv" sliceLength={7} userId={userId} />
      <CardFlow contentType="tv" userId={userId} />
    </section>
    </>
  )
}

export default page
