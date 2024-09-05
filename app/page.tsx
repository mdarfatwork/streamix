import Banner from "@/components/home/Banner";
import dynamic from "next/dynamic";
import { auth } from '@clerk/nextjs/server';
import Head from "next/head";

const WorldMap = dynamic(() => import("@/components/home/WorldMap"), { ssr: false });

export default function Home() {
  const { userId } : { userId: string | null } = auth();
  return (
    <>
    <Head>
      <link rel="preconnect" href="https://api.themoviedb.org" />
    </Head>
    <section className="min-h-screen">
      <Banner contentType="movie" sliceLength={7} userId={userId} />
      <h2 className="text-center text-blue-500 font-bold text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl py-1 md:py-2 xl:py-3">Discover Movies by Country</h2>
      <div className="min-h-96 sm:min-h-[400px] md:min-h-[450px] lg:min-h-[500px] xl:min-h-[600px] 2xl:min-h-[700px]">
      <WorldMap/>
      </div>
    </section>
    </>
  );
}