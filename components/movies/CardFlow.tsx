"use client"
import React, { useState, useEffect, useRef, useMemo, useCallback, Fragment } from 'react';
import axios from 'axios';
import HorizontalCard from './HorizontalCard'
import VerticalCard from './VerticalCard';
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";

interface Content {
    id: number;
    title?: string;
    name?: string;
    backdrop_path: string | null;
    poster_path: string | null;
    overview: string;
    release_date?: string;
    first_air_date?: string;
    genre_ids: number[];
}

interface Genre {
    id: number;
    name: string;
    endpoint: string;
}

const moviesGenres: Genre[] = [
    { id: 0, name: "Trending", endpoint: "3/trending/movie/day" },
    { id: 10749, name: "Romance", endpoint: "3/discover/movie?with_genres=10749" },
    { id: 28, name: "Action", endpoint: "3/discover/movie?with_genres=28" },
    { id: 35, name: "Comedy", endpoint: "3/discover/movie?with_genres=35" },
    { id: 80, name: "Crime", endpoint: "3/discover/movie?with_genres=80" },
    { id: 27, name: "Horror", endpoint: "3/discover/movie?with_genres=27" },
    { id: 10751, name: "Family", endpoint: "3/discover/movie?with_genres=10751" },
    { id: 12, name: "Adventure", endpoint: "3/discover/movie?with_genres=12" },
    { id: 16, name: "Animation", endpoint: "3/discover/movie?with_genres=16" },
    { id: 99, name: "Documentary", endpoint: "3/discover/movie?with_genres=99" },
    { id: 18, name: "Drama", endpoint: "3/discover/movie?with_genres=18" },
    { id: 14, name: "Fantasy", endpoint: "3/discover/movie?with_genres=14" },
    { id: 36, name: "History", endpoint: "3/discover/movie?with_genres=36" },
    { id: 10402, name: "Music", endpoint: "3/discover/movie?with_genres=10402" },
    { id: 9648, name: "Mystery", endpoint: "3/discover/movie?with_genres=9648" },
    { id: 878, name: "Science Fiction", endpoint: "3/discover/movie?with_genres=878" },
    { id: 10770, name: "TV", endpoint: "3/discover/movie?with_genres=10770" },
    { id: 53, name: "Thriller", endpoint: "3/discover/movie?with_genres=53" },
    { id: 10752, name: "War", endpoint: "3/discover/movie?with_genres=10752" },
    { id: 37, name: "Western", endpoint: "3/discover/movie?with_genres=37" },
];

const seriesGenres: Genre[] = [
    { "id": 0, "name": "Trending", "endpoint": "3/trending/tv/day" },
    { "id": 10759, "name": "Action & Adventure", "endpoint": "3/discover/tv?with_genres=10759" },
    { "id": 16, "name": "Animation", "endpoint": "3/discover/tv?with_genres=16" },
    { "id": 35, "name": "Comedy", "endpoint": "3/discover/tv?with_genres=35" },
    { "id": 80, "name": "Crime", "endpoint": "3/discover/tv?with_genres=80" },
    { "id": 99, "name": "Documentary", "endpoint": "3/discover/tv?with_genres=99" },
    { "id": 18, "name": "Drama", "endpoint": "3/discover/tv?with_genres=18" },
    { "id": 10751, "name": "Family", "endpoint": "3/discover/tv?with_genres=10751" },
    { "id": 10762, "name": "Kids", "endpoint": "3/discover/tv?with_genres=10762" },
    { "id": 9648, "name": "Mystery", "endpoint": "3/discover/tv?with_genres=9648" },
    { "id": 10763, "name": "News", "endpoint": "3/discover/tv?with_genres=10763" },
    { "id": 10764, "name": "Reality", "endpoint": "3/discover/tv?with_genres=10764" },
    { "id": 10765, "name": "Sci-Fi & Fantasy", "endpoint": "3/discover/tv?with_genres=10765" },
    { "id": 10766, "name": "Soap", "endpoint": "3/discover/tv?with_genres=10766" },
    { "id": 10767, "name": "Talk", "endpoint": "3/discover/tv?with_genres=10767" },
    { "id": 10768, "name": "War & Politics", "endpoint": "3/discover/tv?with_genres=10768" },
    { "id": 37, "name": "Western", "endpoint": "3/discover/tv?with_genres=37" }
];

const CardFlow = ({ userId, contentType }: { userId: string | null, contentType: "movie" | "tv" }) => {
    const [contentByGenre, setContentByGenre] = useState<{ [key: number]: Content[] }>({});
    const [pageByGenre, setPageByGenre] = useState<{ [key: number]: number }>({});
    const scrollRefs = useRef<{ [key: number]: React.RefObject<HTMLDivElement> }>({});

    const genres = useMemo(() => (contentType === "movie" ? moviesGenres : seriesGenres), [contentType]);

    const fetchContent = useCallback(async (genreId: number, page: number, endpoint: string) => {
        try {
          const url = genreId === 0
            ? `https://api.themoviedb.org/${endpoint}?page=${page}`
            : `https://api.themoviedb.org/${endpoint}&language=en-IN&page=${page}`;
    
          const res = await axios.get(url, {
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_MOVIE_API_Read_Access_Token}`,
            },
          });
    
          setContentByGenre(prev => ({
            ...prev,
            [genreId]: [
              ...(prev[genreId] || []),
              ...res.data.results.filter((item: Content) =>
                !prev[genreId]?.some(prevItem => prevItem.id === item.id)
              ),
            ],
          }));
    
          setPageByGenre(prev => ({ ...prev, [genreId]: page }));
        } catch (error) {
          console.error('Error fetching content:', error);
        }
      }, []);

    const handleScroll = useCallback((scrollRef: React.RefObject<HTMLDivElement>, genreId: number, page: number, endpoint: string) => {
        if (scrollRef.current) {
          const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
          if (scrollLeft + clientWidth >= scrollWidth - 50) {
            fetchContent(genreId, page + 1, endpoint);
          }
        }
      }, [fetchContent]);

      const scrollContent = useCallback((arrow: 'left' | 'right', genreId: number, endpoint: string) => {
        const windowLength = window.innerWidth;
        const pixel = windowLength <= 640 ? 200 : windowLength <= 768 ? 300 : windowLength <= 1024 ? 400 : 600;
    
        const scrolling = scrollRefs.current[genreId];
        if (scrolling?.current) {
          scrolling.current.scrollBy({
            left: arrow === 'left' ? -pixel : pixel,
            behavior: 'smooth',
          });
          handleScroll(scrolling, genreId, pageByGenre[genreId] || 1, endpoint);
        }
      }, [handleScroll, pageByGenre]);

      useEffect(() => {
        const fetchContentSequentially = async () => {
          for (const genre of genres) {
            if (!scrollRefs.current[genre.id]) {
              scrollRefs.current[genre.id] = React.createRef();
            }
            await fetchContent(genre.id, pageByGenre[genre.id] || 1, genre.endpoint);
          }
        };
        fetchContentSequentially();
      }, [contentType, fetchContent, genres]);

    return (
        <>
            {genres.map((genre) => (
                <Fragment key={genre.id}>
                    <h2 className="pl-4 text-blue-500 text-xl font-bold">{genre.name} {contentType === "movie" ? "Movies" : "Series"}</h2>
                    <div className={`relative px-4 w-full ${genre.id === 16 || genre.id === 10770 ? "max-h-96 h-80" : "max-h-44 h-44"} overflow-x-scroll no-scrollbar`}>
                        <>
                            <button className="absolute left-0 flex items-center justify-center h-full mx-5 z-30 outline-0">
                                <span onClick={() => scrollContent("left", genre.id, genre.endpoint)} className="bg-blue-500 text-blue-50 p-1 rounded-full text-3xl cursor-pointer"><MdOutlineKeyboardArrowLeft /></span>
                            </button>
                            <div ref={scrollRefs.current[genre.id]} className="flex gap-4 w-full overflow-hidden">
                                {(contentByGenre[genre.id] || []).map((item) => (
                                    genre.id === 16 || genre.id === 10770 ?
                                        <VerticalCard key={item.id} userId={userId} contentData={item as Content} /> :
                                        <HorizontalCard key={item.id} userId={userId} contentData={item as Content} />
                                ))}
                            </div>
                            <button className="absolute right-0 top-0 flex items-center justify-center h-full mx-5 z-40 outline-0">
                                <span onClick={() => scrollContent("right", genre.id, genre.endpoint)} className="bg-blue-500 text-blue-50 p-1 rounded-full text-3xl cursor-pointer rotate-180"><MdOutlineKeyboardArrowLeft /></span>
                            </button>
                        </>
                    </div>
                </Fragment>
            ))}
        </>
    )
}
export default CardFlow;