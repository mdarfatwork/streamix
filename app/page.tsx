"use client"
import Banner from "@/components/home/Banner";
import dynamic from "next/dynamic";
const WorldMap = dynamic(() => import("@/components/home/WorldMap"), { ssr: false });

export default function Home() {
  return (
    <section>
      <Banner/>
      <h2 className="text-center text-blue-500 font-bold text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl py-1 md:py-2 xl:py-3">Discover Movies by Country</h2>
      <WorldMap/>
    </section>
  );
}