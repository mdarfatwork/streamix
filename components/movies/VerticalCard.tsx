"use client"
import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { fetchCommonImage } from '../stream/fetchCommonImage';

interface ContentData {
    id: number;
    title?: string;
    name?: string;
    backdrop_path: string | null;
    poster_path: string | null;
}

const VerticalCard = ({ userId, contentData }: { userId: string | null, contentData: ContentData }) => {
    const displayName = useMemo(() => contentData.title || contentData.name || "Unknown", [contentData]);
    const [state, setState] = useState({
        isVisible: false,
        imageLoading: true,
        commonImage: null as string | null,
    });
    const cardRef = useRef<HTMLDivElement | null>(null);

    const observer = useMemo(() => new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setState(prev => ({ ...prev, isVisible: true }));
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.10 } // Start loading when 10% is visible
    ), []);

    useEffect(() => {
        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => {
            if (cardRef.current) {
                observer.unobserve(cardRef.current);
            }
        };
    }, [observer]);

    const fetchAndSetCommonImage = useCallback(async () => {
        const content = contentData.title ? "movie" : "tv";
        const response = await fetchCommonImage(content, contentData.id, 0.67); // Aspect ratio for vertical card
        setState(prev => ({ ...prev, commonImage: response }));
    }, [contentData.id, contentData.title]);

    useEffect(() => {
        if (!contentData.poster_path) {
            fetchAndSetCommonImage();
        }
    }, [contentData.poster_path, fetchAndSetCommonImage]);

    const handleImageLoad = useCallback(() => {
        setState(prev => ({ ...prev, imageLoading: false }));
    }, []);

    const handleImageError = useCallback(() => {
        setState(prev => ({ ...prev, imageLoading: false }));
    }, []);

    return (
        <div ref={cardRef} className="relative min-w-48 min-h-80 max-h-80 rounded-md overflow-hidden cursor-pointer z-20">
            <Link href={userId === null ? "/sign-in" : `/watch?${contentData.title ? "movie" : "series"}=${contentData.id}`}>
                {state.isVisible ? (
                    <>
                        {/* Loading animation */}
                        {state.imageLoading && (
                            <div className="absolute inset-0 h-full w-full">
                                <div className="h-full rounded-md bg-gradient-to-r from-gray-100 to-gray-300 animate-pulse"></div>
                            </div>
                        )}

                        {/* Image layer */}
                        {(contentData.poster_path || state.commonImage) && (
                            <Image
                                src={`https://image.tmdb.org/t/p/original/${contentData.poster_path || state.commonImage}`}
                                alt={displayName}
                                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${state.imageLoading ? 'opacity-0' : 'opacity-100'}`}
                                width={250}
                                height={250}
                                quality={50} // Balance quality and performance
                                loading="lazy"
                                decoding="async"
                                sizes="(max-width: 600px) 100vw, (max-width: 1200px) 33vw, 25vw"
                                onLoad={handleImageLoad}
                                onError={handleImageError}
                            />
                        )}
                    </>
                ) : (
                    <div className="bg-gray-200 text-gray-400 w-full h-full flex flex-col items-center justify-center">
                        <span className="text-lg lg:text-xl font-bold text-center">{displayName}</span>
                        <span className="text-base lg:text-lg text-center">STREAMIX</span>
                    </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-lg font-semibold text-center">{displayName}</p>
                </div>
            </Link>
        </div>
    )
}

export default VerticalCard;