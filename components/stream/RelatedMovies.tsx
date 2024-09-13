"use client"
import React from 'react'
import HorizontalCard from '../movies/HorizontalCard';
import { motion } from 'framer-motion';

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

interface RelatedMoviesProps {
    content: Movie[] | null;
    userId: string | null;
}

const RelatedMovies = ({ content, userId }: RelatedMoviesProps) => {
    if (!content) return null;
    return (
        <motion.div className="flex gap-4 w-full flex-wrap justify-center"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}>
            {content.map((item) => (
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    key={item.id}
                >
                    <HorizontalCard userId={userId} contentData={item as Movie} />
                </motion.div>
            ))}
        </motion.div>
    )
}

export default RelatedMovies
