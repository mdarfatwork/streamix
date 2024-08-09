"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { RxCross1 } from 'react-icons/rx'
import Image from 'next/image';
import Link from 'next/link';
import debounce from "lodash.debounce";

type Props = {
    countryCode: string | undefined;
    onSend: (arg: any) => void;
};

interface Movie {
    id: number;
    title: string;
    poster_path: string | null;
    release_date: string;
}

const ShowMovies: React.FC<Props> = ({ countryCode, onSend }) => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState<boolean>();

    const fetchMovies = debounce(async () => {
        try {
            setLoading(true);
            const responseMovies = await axios.get(`https://api.themoviedb.org/3/discover/movie?include_adult=false&page=1&sort_by=popularity.desc&with_origin_country=${countryCode}`, {
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_MOVIE_API_Read_Access_Token}`
                }
            });
            setMovies(responseMovies.data.results);
        } catch (error) {
            console.error('Error fetching movies:', error);
        } finally {
            setLoading(false);
        }
    }, 300);
    
    useEffect(() => {
        if (countryCode) fetchMovies();
    }, [countryCode, fetchMovies]);

    return (
        <div className="w-full px-4 bg-blue-50 z-10 pb-2">
            {loading ? (
                <div className="h-96 sm:h-[400px] md:h-[450px] lg:h-[500px] xl:h-[600px] 2xl:h-[700px] rounded-md bg-gradient-to-r from-gray-100 to-gray-300 animate-pulse"></div>
            ) : (
                <div className="bg-blue-500 rounded-md p-3 min-h-96 sm:min-h-[400px] md:min-h-[450px] lg:min-h-[500px] xl:min-h-[600px] 2xl:min-h-[700px] relative">
                    <span onClick={() => onSend(false)} className='absolute top-2 md:top-3 xl:top-4 right-2 md:right-3 xl:right-4 z-10 p-3 bg-blue-50 text-blue-500 rounded-full cursor-pointer'><RxCross1 /></span>
                    <div className="grid grid-cols-1 gap-4 md:gap-6 xl:gap-8 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 p-2 md:p-3 xl:p-4">
                        {movies.length > 0 ? (
                            movies.filter(movie => movie.poster_path).map((movie) => (
                                <div key={movie.id} className="relative cursor-pointer">
                                    <Link href="/sign-in">
                                        <Image
                                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                            width={500}
                                            height={500}
                                            alt={movie.title}
                                            className="w-full h-[90%] object-cover rounded-lg"
                                        />
                                        <p className='py-2 text-center text-blue-50'>{movie.title} ({new Date(movie.release_date).getFullYear()})</p>
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <span className='py-2 text-center text-xl'>No movies to Show from this country</span>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ShowMovies