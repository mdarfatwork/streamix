"use client"
import React, { useEffect, useState } from 'react'
import CastDetails from './CastDetails';
import RelatedMovies from './RelatedMovies';
import axios from 'axios';
import SeriesHorizontalCard from './SeriesHorizontalCard';

interface CastMember {
    id: number;
    name: string;
    character: string;
    popularity: number;
    profile_path: string | null;
    known_for_department: string;
}

interface Content {
    id: number;
    title?: string;
    name?: string;
    backdrop_path: string | null;
    poster_path: string | null;
    overview: string;
    release_date?: string;
    first_air_date?: string;
    genres: { id: number; name: string }[];
}

interface Episode {
    id: number;
    name: string;
    episode_number: number;
    season_number: number;
    overview: string;
    still_path: string | null;
}

interface SeriesDetailsFlowProps {
    cast: CastMember[];
    content: Content[] | null;
    seriesId: string;
    seasons: any;
    userId: string | null;
}

const fetchSeasonEpisode = async (seriesId: string, seasonNumber: number) => {
    try {
        const response = await axios.get(
            `https://api.themoviedb.org/3/tv/${seriesId}/season/${seasonNumber}?language=en-US`,
            {
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${process.env.NEXT_PUBLIC_MOVIE_API_Read_Access_Token}`,
                },
            }
        );
        return response.data.episodes as Episode[];
    } catch (error) {
        console.error(`Error fetching episodes for season ${seasonNumber}:`, error);
        return [];
    }
};

const SeriesDetailsFlow = ({ cast, content, seriesId, seasons, userId }: SeriesDetailsFlowProps) => {
    const [isShow, setIsShow] = useState<"episode" | "cast" | "details">("episode")
    const [selectedSeason, setSelectedSeason] = useState<number>(seasons.length > 1 ? seasons[0].season_number : 1);
    const [episodes, setEpisodes] = useState<Episode[]>([]);

    useEffect(() => {
        const fetchSeasonEpisodes = async () => {
            const episodes = await fetchSeasonEpisode(seriesId, selectedSeason);
            setEpisodes(episodes);
        };
        fetchSeasonEpisodes();
    }, [selectedSeason, seriesId]);

    return (
        <section className="bg-blue-500 p-3 rounded-md">
            <ul className='flex gap-2 font-semibold text-lg lg:text-xl text-blue-50'>
                <li onClick={() => setIsShow("episode")} className={`${isShow === "episode" && "underline"} cursor-pointer`}>Episodes</li>
                <li onClick={() => setIsShow("cast")} className={`${isShow === "cast" && "underline"} cursor-pointer`}>Cast</li>
                <li onClick={() => setIsShow("details")} className={`${isShow === "details" && "underline"} cursor-pointer`}>Related</li>
            </ul>
            {isShow === "episode" && (
                <section>
                    {seasons.length > 1 && (
                        <ul className="flex gap-2 my-4">
                            {seasons.map((season: any) => (
                                <li
                                    key={season.season_number}
                                    onClick={() => setSelectedSeason(season.season_number)}
                                    className={`cursor-pointer px-4 py-2 rounded-md ${selectedSeason === season.season_number ? 'bg-blue-700 text-white' : 'bg-blue-300 text-blue-700'}`}
                                >
                                    Season {season.season_number}
                                </li>
                            ))}
                        </ul>
                    )}

                    <div className="flex gap-4 w-full flex-wrap">
                        {episodes.map((episode) => (
                            <SeriesHorizontalCard
                                key={episode.id}
                                seriesId={seriesId}
                                contentData={{
                                    id: episode.id,
                                    title: episode.name,
                                    backdrop_path: episode.still_path,
                                    overview: episode.overview,
                                }}
                            />
                        ))}
                    </div>
                </section>
            )}
            {isShow === "cast" && <CastDetails cast={cast} />}
            {isShow === "details" && <RelatedMovies content={content} userId={userId} />}
        </section>
    )
}

export default SeriesDetailsFlow