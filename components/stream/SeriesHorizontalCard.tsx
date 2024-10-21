"use client"
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { fetchCommonImage } from './fetchCommonImage';

interface ContentData {
    id: number;
    title: string;
    backdrop_path: string | null;
    overview: string;
}

const SeriesHorizontalCard = ({ contentData, seriesId }: { contentData: ContentData, seriesId: string | number }) => {
    const [commonImage, setCommonImage] = useState<string | null>(null);
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
            { threshold: 0.10 }
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

    const fetchAndSetCommonImage = async () => {
        const response = await fetchCommonImage("tv", seriesId, 1.8);
        setCommonImage(response);
    };

    useEffect(() => {
        if (!contentData.backdrop_path) {
            fetchAndSetCommonImage();
        }
    }, [contentData.backdrop_path, seriesId, fetchAndSetCommonImage]);


    return (
        <motion.div ref={cardRef} className="relative min-w-72 max-w-72 min-h-40 max-h-40 rounded-md overflow-hidden cursor-pointer z-20" whileHover={{ scale: 1.1 }}>
            {isVisible && (contentData.backdrop_path || commonImage) ? (
                <Image
                    src={`https://image.tmdb.org/t/p/original/${contentData.backdrop_path || commonImage}`}
                    alt={contentData.title}
                    className="w-full h-full object-cover"
                    width={250}
                    height={250}
                    quality={20}
                    loading="lazy"
                    decoding="async"
                    sizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            ) : (
                // Show this code if the contentData.backdrop_path and common image is null
                <div className="bg-gray-200 text-gray-400 w-full min-h-40 h-full flex flex-col items-center justify-center">
                    <span className="text-lg lg:text-xl font-bold text-center">{contentData.title}</span>
                    <span className="text-base lg:text-lg text-center">STREAMIX</span>
                </div>
            )}
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                <p className="text-white text-lg font-semibold text-center">{contentData.title}</p>
            </div>
        </motion.div>
    )
}

export default SeriesHorizontalCard;