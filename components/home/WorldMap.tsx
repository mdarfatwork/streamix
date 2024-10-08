"use client"
import React, { useCallback, useState } from 'react'
import { VectorMap } from "@react-jvectormap/core";
import { worldMill } from "@react-jvectormap/world"
import dynamic from "next/dynamic";

const ShowMovies = dynamic(() => import("./ShowMovies"), { ssr: false });

interface Country {
    name: string;
    code: string;
}

const WorldMap = () => {
    const [country, setCountry] = useState<Country | null>(null);
    const [moviesShow, setMoviesShow] = useState<boolean>(false);

    const handleRegionClick = useCallback((event: any, code: string) => {
        const countryPaths = worldMill.content.paths as Record<string, { name: string; path: string }>;
        const countryName = countryPaths[code]?.name;
        setCountry({ name: countryName, code: code });
        setMoviesShow(true);
    }, []);
    

    const handleCloseMovies = useCallback(() => {
        setMoviesShow(false);
        setCountry(null);
    }, []);
    

    return (
        <div className='relative'>
            <div className={`${moviesShow && "hidden"} mx-4 my-2 h-96 sm:h-[400px] md:h-[450px] lg:h-[500px] xl:h-[600px] 2xl:h-[700px] bg-blue-200 rounded-md overflow-hidden mb-6`}>
                <VectorMap
                    map={worldMill}
                    backgroundColor="#bfdbfe"
                    zoomAnimate={true}
                    zoomOnScroll={true}
                    onRegionClick={handleRegionClick}
                    style={{ cursor: 'pointer' }}
                    />
            </div>
            {moviesShow && <ShowMovies countryCode={country?.code} onSend={handleCloseMovies} />}
        </div>
    )
}

export default WorldMap;