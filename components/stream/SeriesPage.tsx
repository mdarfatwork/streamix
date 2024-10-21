import React from 'react'
import axios from 'axios';
import Player from './Player';
import SeriesDetailsFlow from './SeriesDetailsFlow';

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

const fetchSeriesVideo = async (seriesId: string) => {
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/tv/${seriesId}/videos?language=en-IN`, {
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
    const teaser = youtubeVideos.filter((video: any) => video.type === 'Teaser');

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
    } else if (teaser.length > 0) {
      // Sort teaser by length and pick the one with the highest length
      selected = clips.reduce((prev: any, current: any) => {
        return prev.size > current.size ? prev : current;
      });
    } else if (youtubeVideos.length > 0) {
      // If no trailers, teaser or clips, pick a random video
      selected = youtubeVideos[Math.floor(Math.random() * youtubeVideos.length)];
    } else {
      // If no YouTube videos, return the fallback video
      selected = { key: '05DqIGS_koU', name: 'Fallback Video' };
    }

    return selected
  } catch (error) {
    console.error('Error fetching video data:', error);
    return { key: '05DqIGS_koU', name: 'Fallback Video' }
  }
}

const fetchSeriesDetails = async (seriesId: string) => {
  try {
      const response = await axios.get(
          `https://api.themoviedb.org/3/tv/${seriesId}/credits?language=en-US`,
          {
              headers: {
                  accept: 'application/json',
                  Authorization: `Bearer ${process.env.NEXT_PUBLIC_MOVIE_API_Read_Access_Token}`,
              },
          }
      );
      return response.data as any
  } catch (error) {
      console.error('Error fetching movie details:', error);
      return [];
  }
};

const fetchRelatedSeries = async (seriesId: string) => {
  try {
      const response = await axios.get(`https://api.themoviedb.org/3/tv/${seriesId}/recommendations?language=en-US&page=1`, {
          headers: {
              accept: 'application/json',
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_MOVIE_API_Read_Access_TOKEN}`
          }
      })
      return response.data.results as Content[]
  } catch (error) {
      console.error(`Error while fetching related movies ${error}`)
      return null;
  }
}

const fetchCommonImage = async (seriesId: string) => {
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/tv/${seriesId}/images`, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_MOVIE_API_Read_Access_Token}`,
      },
    })
    const backdrops = response.data.backdrops;
    if (!backdrops || backdrops.length === 0) {
      console.error("No backdrops found");
      return null;
    }

    const targetAspectRatio = 1.8;

    const closestImage = backdrops.reduce((closest: any, current: any) => {
      const currentDiff = Math.abs(current.aspect_ratio - targetAspectRatio);
      const closestDiff = Math.abs(closest.aspect_ratio - targetAspectRatio);
      return currentDiff < closestDiff ? current : closest;
    });

    return closestImage.file_path;

  } catch (error: any) {
    console.error(`Error while fetching Common Image: ${error.message}`)
    return null;
  }
}

const SeriesPage = async ({ userId, seriesId }: { seriesId: string, userId: string | null }) => {
  const youtubeVideo = await fetchSeriesVideo(seriesId)
  const data = await fetchSeriesDetails(seriesId)
  const cast = data.cast as CastMember[]
  const relatedcontent = await fetchRelatedSeries(seriesId)

  // Fetch season details
  const seasonDataResponse = await axios.get(`https://api.themoviedb.org/3/tv/${seriesId}?language=en-US`, {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_MOVIE_API_Read_Access_Token}`,
    },
  });
  
  const seasons = seasonDataResponse.data.seasons;

  const CommonImage = await fetchCommonImage(seriesId)

  return (
    <>
      <Player videoId={seriesId} video={youtubeVideo} />
      <main className='w-full p-5'>
        <SeriesDetailsFlow seasons={seasons} seriesId={seriesId} cast={cast} content={relatedcontent} userId={userId}/>
      </main>
    </>
  )
}

export default SeriesPage;