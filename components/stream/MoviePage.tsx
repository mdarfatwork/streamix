import React from 'react'
import axios from 'axios';
import Player from './Player';
import DetailsFlow from './DetailsFlow';

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

interface CastMember {
    id: number;
    name: string;
    character: string;
    popularity: number;
    profile_path: string | null;
    known_for_department: string;
}

const fetchMovieVideo = async (movieId: string) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-IN`, {
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_MOVIE_API_Read_Access_Token}`
            }
        });

        const data = response.data.results;

        // Filter only YouTube videos
        const youtubeVideos = data.filter((video: any) => video.site === 'YouTube');

        // Get all trailers and clips
        const trailers = youtubeVideos.filter((video: any) => video.type === 'Trailer');
        const clips = youtubeVideos.filter((video: any) => video.type === 'Clip');

        let selected;

        if (trailers.length > 0) {
            // Sort trailers by length and pick the one with the highest length (if applicable)
            selected = trailers.reduce((prev: any, current: any) => {
                return prev.size > current.size ? prev : current;
            });
        } else if (clips.length > 0) {
            // Sort clips by length and pick the one with the highest length
            selected = clips.reduce((prev: any, current: any) => {
                return prev.size > current.size ? prev : current;
            });
        } else if (youtubeVideos.length > 0) {
            // If no trailers or clips, pick a random video
            selected = youtubeVideos[Math.floor(Math.random() * youtubeVideos.length)];
        } else {
            // If no YouTube videos, return the fallback video
            selected = { key: '05DqIGS_koU', name: 'Fallback Video' };
        }

        return selected
    } catch (error) {
        console.error('Error fetching video data:', error);
        return null
    }
}

const fetchMovieDetails = async (movieId: string) => {
    try {
        const response = await axios.get(
            `https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US`,
            {
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_MOVIE_API_Read_Access_Token}`,
                },
            }
        );
        return response.data.cast as CastMember[];
    } catch (error) {
        console.error('Error fetching movie details:', error);
        return [];
    }
};

const fetchRelatedMovies = async (movieId: string) => {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/recommendations?language=en-US&page=1`, {
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_MOVIE_API_Read_Access_TOKEN}`
            }
        })
        return response.data.results as Movie[]
    } catch (error) {
        console.error(`Error while fetching related movies ${error}`)
        return null;
    }
}

const MoviePage = async ({ movieId, userId }: { movieId: string, userId:string | null }) => {
    const youtubeVideo = await fetchMovieVideo(movieId)
    const cast = await fetchMovieDetails(movieId);
    const relatedMovies = await fetchRelatedMovies(movieId);

    return (
        <>
            <Player videoId={movieId} video={youtubeVideo} />
            <main className='w-full p-5'>
            <DetailsFlow cast={cast} content={relatedMovies} userId={userId}/>
            </main>
        </>
    )
}

export default MoviePage