"use client"
import React from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image';
import Link from 'next/link';

interface CastMember {
    id: number;
    name: string;
    character: string;
    popularity: number;
    profile_path: string | null;
    known_for_department: string;
}

const CastDetails = ({ cast }: { cast: CastMember[] }) => {
    const actingCast = cast
        .filter((member) => member.known_for_department === 'Acting')
        .sort((a, b) => b.popularity - a.popularity);

    if (!actingCast.length) return <p>No cast available</p>;
    return (
        <motion.section
            className="w-full py-8 flex flex-wrap gap-4 justify-center text-blue-50"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
        >
            {actingCast.map((member) => (
                <motion.div
                    key={member.id}
                    className="w-[150px] flex flex-col items-center cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                >
                    <Link href={`person?id=${member.id}`}>
                        {member.profile_path ? (
                            <Image
                                src={`https://image.tmdb.org/t/p/w300${member.profile_path}`}
                                alt={member.name}
                                width={150}
                                height={225}
                                className="rounded-lg"
                                loading="lazy"
                            />
                        ) : (
                            <div className="w-[150px] h-[225px] bg-gray-300 flex items-center justify-center rounded-lg">
                                <p className="text-center text-gray-500">{member.name}</p>
                            </div>
                        )}
                        <p className="mt-2 font-semibold text-center">{member.name}</p>
                        <p className="text-sm text-center">{member.character}</p>
                    </Link>
                </motion.div>
            ))}
        </motion.section>
    )
}

export default CastDetails