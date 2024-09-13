"use client"
import React from 'react';

const Player = ({ movie, movieId }: { movie: any, movieId: string }) => {

    return (
        <>
            {movie ? (
                <section className='w-full min-h-screen flex items-center justify-center p-5'>
                    <div className='relative w-full h-0' style={{ paddingBottom: '56.25%' }}>
                        <iframe
                            key={movieId}
                            src={`https://www.youtube.com/embed/${movie.key}`}
                            title={movie.name}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className='absolute top-0 left-0 w-full h-full'
                        />
                    </div>
                </section>
            ) : (
                <p className='min-h-screen'>No videos available</p>
            )}
        </>
    )
}

export default Player;