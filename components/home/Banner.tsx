"use client"
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css/bundle';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface Content {
  id: number;
  title?: string;
  name?: string;
  backdrop_path: string;
  overview: string;
  release_date?: string;
  first_air_date?: string;
  genre_ids: number[];
}

interface Genres {
  id: number;
  name: string;
}

const Banner = ({ sliceLength, userId, contentType }: { sliceLength: number, userId: string | null, contentType: "movie" | "tv" }) => {
  const [content, setContent] = useState<Content[]>([]);
  const [genres, setGenres] = useState<Genres[]>([]);

  const fetchContent = useCallback(async () => {
    try {
      const [responseGenres, responseContent] = await Promise.all([
        axios.get(`https://api.themoviedb.org/3/genre/${contentType}/list?language=en`, {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_MOVIE_API_Read_Access_Token}`
          }
        }),
        axios.get(`https://api.themoviedb.org/3/trending/${contentType}/day?language=en-IN`, {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_MOVIE_API_Read_Access_Token}`
          }
        })
      ]);

      setGenres(responseGenres.data.genres);
      setContent(responseContent.data.results.slice(0, sliceLength));
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  }, [contentType, sliceLength]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const truncateOverview = useCallback((overview: string, maxLength: number = 150) => {
    if (overview.length <= maxLength) {
      return overview;
    }

    let truncated = overview.substring(0, maxLength);
    const lastSpaceIndex = truncated.lastIndexOf(' ');

    if (lastSpaceIndex === -1) {
      return truncated + '...';
    }

    truncated = truncated.substring(0, lastSpaceIndex);

    return truncated + '...';
  }, []);

  const formatDate = useCallback((dateString: string | undefined): string => {
    if (typeof dateString !== 'string') return '';

    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, ' ');
  }, []);

  const contentSlides = useMemo(() => (
    content.map((item, index) => (
      <SwiperSlide key={item.id}>
        <div className="w-full h-full bg-cover bg-center relative">
          <Image src={`https://image.tmdb.org/t/p/original${item.backdrop_path}`} alt={(item.title || item.name) as string}
            className='absolute top-0 w-auto h-auto object-cover object-center -z-10'
            fill={true} priority={index === 0} loading={index === 0 ? "eager" : "lazy"} quality={30} />
          <div className="bg-gray-900 bg-opacity-50 w-full h-full flex items-center justify-center lg:justify-start lg:pl-24 xl:pl-32">
            <div className="text-center lg:text-left text-white flex flex-col gap-2 lg:gap-3">
              <h2 className="text-3xl font-bold">{item.title || item.name}</h2>
              <p><span className='hidden lg:block lg:w-3/5 xl:w-1/2 2xl:w-5/12'>{truncateOverview(item.overview)}</span></p>
              <div>
                <div className="flex gap-2 font-medium text-gray-50">
                  {item.genre_ids.map((genreId) => (
                    <span key={genreId}>{genres.find((g) => g.id === genreId)?.name}</span>
                  ))}
                </div>
                <span>Release Date <strong>{formatDate(item.release_date || item.first_air_date)}</strong></span>
              </div>
              <div className="w-full flex items-center justify-center lg:justify-start">
                <Link href={userId === null ? "/sign-in" : `/watch?${contentType === "movie" ? "movie" : "series"}=${item.id}`}>
                  <motion.button className="mt-4 px-4 py-2 w-fit bg-blue-500 text-white font-semibold rounded" whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }}>
                    Play
                  </motion.button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </SwiperSlide>
    ))
  ), [content, genres, truncateOverview, formatDate, userId, contentType]);

  if (content.length === 0) {
    return <div className="relative px-4 py-2 w-full h-80 sm:h-96 md:h-[400px] lg:h-[450px] xl:h-[500px] 2xl:h-[600px]"><div className="h-full rounded-md bg-gradient-to-r from-gray-100 to-gray-300 animate-pulse"></div></div>;
  }

  return (
    <div className="relative px-4 py-2 w-full h-80 sm:h-96 md:h-[400px] lg:h-[450px] xl:h-[500px] 2xl:h-[600px]">
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={50}
        slidesPerView={1}
        navigation
        autoplay={{ delay: 3000 }}
        loop
        className='h-full rounded-md'
      >
        {contentSlides}
      </Swiper>
    </div>
  );
};

export default Banner;