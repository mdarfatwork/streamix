"use client"
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css/bundle';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import Image from 'next/image';

interface Movie {
  id: number;
  title: string;
  backdrop_path: string;
  overview: string;
  release_date: string;
  genre_ids: number[];
}

interface Genres {
  id: number;
  name: string;
}

const Banner = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genres[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const responseGenres = await axios.get('https://api.themoviedb.org/3/genre/movie/list?language=en', {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_MOVIE_API_Read_Access_Token}`
          }
        });
        setGenres(responseGenres.data.genres)

        const responseMovies = await axios.get('https://api.themoviedb.org/3/trending/movie/day?language=en-IN', {
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_MOVIE_API_Read_Access_Token}`
          }
        });
        setMovies(responseMovies.data.results.slice(0, 3));
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, []);

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

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options).replace(/ /g, ' ');
  };

  const movieSlides = useMemo(() => (
    movies.map((movie) => (
      <SwiperSlide key={movie.id}>
        <div className="w-full h-full bg-cover bg-center relative">
          <Image src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`} alt={movie.title} 
          className='absolute top-0 w-auto h-auto object-cover object-center -z-10' fill={true} />
          <div className="bg-gray-900 bg-opacity-50 w-full h-full flex items-center justify-center lg:justify-start lg:pl-24 xl:pl-32">
            <div className="text-center lg:text-left text-white flex flex-col gap-2 lg:gap-3">
              <h2 className="text-3xl font-bold">{movie.title}</h2>
              <p>
                <span className='hidden lg:block lg:w-3/5 xl:w-1/2 2xl:w-5/12'>{truncateOverview(movie.overview)}</span>
              </p>
              <div>
                <div className="flex gap-2 font-medium text-gray-50">
                  {movie.genre_ids.map((genreId) => (
                    <span key={genreId}>{genres.find((g) => g.id === genreId)?.name}</span>
                  ))}
                </div>
                <span>Relase Date <strong>{formatDate(movie.release_date)}</strong></span>
              </div>
              <div className="w-full flex items-center justify-center lg:justify-start">
                <button className="mt-4 px-4 py-2 w-fit bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded">
                  Play
                </button>
              </div>
            </div>
          </div>
        </div>
      </SwiperSlide>
    ))
  ), [movies, genres, truncateOverview]);

  if(movies.length === 0) {
    return <div className="relative px-4 py-2 w-full h-80 sm:h-96 md:h-[400px] lg:h-[450px] xl:h-[500px] 2xl:h-[600px] "><div className="h-full rounded-md bg-gradient-to-r from-gray-100 to-gray-300 animate-pulse"></div></div>
  }

  return (
    <div className="relative px-4 py-2 w-full h-80 sm:h-96 md:h-[400px] lg:h-[450px] xl:h-[500px] 2xl:h-[600px]">
      {movies.length > 0 && (
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={50}
          slidesPerView={1}
          navigation
          autoplay={{ delay: 3000 }}
          loop
          className='h-full rounded-md'
        >
          {movieSlides}
        </Swiper>
      )}
    </div>
  );
};

export default Banner;