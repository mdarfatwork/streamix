"use client"
import React from 'react';

const Player = ({ video, videoId }: { video: any, videoId: string }) => {

    return (
        <>
            {video ? (
                <section className='w-full flex items-center justify-center p-5'>
                    <div className='relative w-full h-0' style={{ paddingBottom: '56.25%' }}>
                        <iframe
                            key={videoId}
                            src={`https://www.youtube.com/embed/${video.key}`}
                            title={video.name}
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