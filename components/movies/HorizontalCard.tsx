"use client"
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ContentData {
    id: number;
    title?: string;
    name?: string;
    backdrop_path: string | null;
    poster_path: string | null;
}

const HorizontalCard = ({ userId, contentData }: { userId: string | null, contentData: ContentData }) => {
    const displayName = contentData.title || contentData.name || "Unknown";
    const [isVisible, setIsVisible] = useState(false);
    const cardRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsVisible(true);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.25 }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => {
            if (cardRef.current) {
                observer.unobserve(cardRef.current);
            }
        };
    }, []);

    return (
        <div ref={cardRef} className="relative min-w-72 max-h-40 rounded-md overflow-hidden cursor-pointer z-20">
            <Link href={userId === null ? "/sign-in" : "/movies"}>
                {isVisible && contentData.backdrop_path ? (
                    <Image
                        src={`https://image.tmdb.org/t/p/original/${contentData.backdrop_path}`}
                        alt={displayName}
                        className="w-full h-full object-cover"
                        width={250}
                        height={250}
                        loading="lazy"
                        decoding="async"
                        sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
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
    );
};

export default HorizontalCard;