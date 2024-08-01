"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { RxCross1 } from 'react-icons/rx'
import Image from 'next/image';

type Props = {
    countryCode: string | undefined;
    onSend: (arg: any) => void;
};

interface Movie {
    id: number;
    title: string;
    poster_path: string;
    release_date: string;
    textColor: string;
}

const ShowMovies: React.FC<Props> = ({ countryCode, onSend }) => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState<boolean>();

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setLoading(true);
                const responseMovies = await axios.get(`https://api.themoviedb.org/3/discover/movie?include_adult=false&page=1&sort_by=popularity.desc&with_origin_country=${countryCode}`, {
                    headers: {
                        accept: 'application/json',
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_MOVIE_API_Read_Access_Token}`
                    }
                });
                setMovies(responseMovies.data.results);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching movies:', error);
                setLoading(false);
            }
        };
        fetchMovies();
    }, []);

    return (
        <div className="absolute top-0 w-full px-4 bg-blue-50 z-10 pb-2">
            {loading ? (
                <div className="h-96 sm:h-[400px] md:h-[450px] lg:h-[500px] xl:h-[600px] 2xl:h-[700px] rounded-md bg-gradient-to-r from-gray-100 to-gray-300 animate-pulse"></div>
            ) : (
                <div className="bg-blue-500 rounded-md p-3">
                    <RxCross1 className='absolute top-1 md:top-2 xl:top-3 right-5 md:right-6 xl:right-7 z-10' onClick={() => onSend(false)} />
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                        {movies.length > 0 && (
                            movies.map((movie) => (
                                <div key={movie.id} className="relative cursor-pointer rounded-lg overflow-hidden">
                                    <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="w-full h-full object-cover" />
                                    <span className="absolute bottom-0 w-full text-center py-4 bg-blue-500 text-blue-50 text-sm font-medium rounded-md">
                                        {movie.title} ({new Date(movie.release_date).getFullYear()})
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ShowMovies