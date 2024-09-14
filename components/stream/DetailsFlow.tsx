"use client"
import React, { useState } from 'react'
import CastDetails from './CastDetails';
import RelatedMovies from './RelatedMovies';

interface CastMember {
  id: number;
  name: string;
  character: string;
  popularity: number;
  profile_path: string | null;
  known_for_department: string;
}

interface Movie {
  id: number;
  title?: string;
  name?: string;
  genres: { id: number; name: string }[];
  release_date: string;
  overview: string;
  backdrop_path: string | null;
  poster_path: string | null;
}

interface DetailsFlowProps {
  cast: CastMember[];
  content: Movie[] | null;
  userId: string | null;
}

const DetailsFlow = ({ cast, content, userId }: DetailsFlowProps) => {
  const [isShow, setIsShow] = useState<"cast" | "details">("cast")
  return (
    <section className="bg-blue-500 p-3 rounded-md">
      <ul className='flex gap-2 font-semibold text-lg lg:text-xl text-blue-50'>
        <li onClick={()=>setIsShow("cast")} className={`${isShow === "cast" && "underline"} cursor-pointer`}>Cast</li>
        <li onClick={()=>setIsShow("details")} className={`${isShow === "details" && "underline"} cursor-pointer`}>Related</li>
      </ul>
        {isShow === "cast"? <CastDetails cast={cast} /> : <RelatedMovies content={content} userId={userId} />}
    </section>
  )
}

export default DetailsFlow
