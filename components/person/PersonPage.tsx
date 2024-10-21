"use client"
import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaFacebook, FaInstagram, FaTiktok, FaTwitter, FaYoutube } from 'react-icons/fa';
import HorizontalCard from '../movies/HorizontalCard';
import { fetchCommonImage } from '../stream/fetchCommonImage';

interface PersonDetails {
  id: number;
  name: string;
  biography: string;
  birthday: string;
  also_known_as: string[];
  gender: number;
  deathday: string | null;
  place_of_birth: string;
  profile_path: string | null;
}

interface ContentData {
  id: number;
  title?: string;
  name?: string;
  backdrop_path: string | null;
  poster_path: string | null;
}

interface SocialMedia {
  id: number;
  facebook_id: string | null;
  instagram_id: string | null;
  tiktok_id: string | null;
  twitter_id: string | null;
  youtube_id: string | null;
}

interface PersonDetailsProps {
  userId: string | null;
  personDetails: PersonDetails | null;
  personContent: ContentData[] | null;
  personSocialMedia: SocialMedia | null;
}

const PersonPage = ({ userId, personDetails, personContent, personSocialMedia }: PersonDetailsProps) => {
  const [commonImage, setCommonImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);

  const formatDate = useCallback((dateString: string | undefined): string => {
    if (typeof dateString !== 'string') return '';

    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, ' ');
  }, []);

  const getGender = useCallback((gender: number): string => {
    switch (gender) {
      case 1:
        return 'Female';
      case 2:
        return 'Male';
      case 3:
        return 'Non-binary';
      default:
        return 'Not specified';
    }
  }, []);

  const fetchAndSetCommonImage = useCallback(async () => {
    if (personDetails && !personDetails.profile_path) {
      const response = await fetchCommonImage('person', personDetails.id, 0.66);
      setCommonImage(response);
    }
  }, [personDetails]);

  useEffect(() => {
    fetchAndSetCommonImage();
  }, [fetchAndSetCommonImage]);

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
  };

  const socialMediaLinks = [
    { platform: 'Facebook', id: personSocialMedia?.facebook_id, url: `https://facebook.com/${personSocialMedia?.facebook_id}`, icon: <FaFacebook /> },
    { platform: 'Instagram', id: personSocialMedia?.instagram_id, url: `https://instagram.com/${personSocialMedia?.instagram_id}`, icon: <FaInstagram /> },
    { platform: 'TikTok', id: personSocialMedia?.tiktok_id, url: `https://tiktok.com/@${personSocialMedia?.tiktok_id}`, icon: <FaTiktok /> },
    { platform: 'Twitter', id: personSocialMedia?.twitter_id, url: `https://twitter.com/${personSocialMedia?.twitter_id}`, icon: <FaTwitter /> },
    { platform: 'YouTube', id: personSocialMedia?.youtube_id, url: `https://youtube.com/${personSocialMedia?.youtube_id}`, icon: <FaYoutube /> }
  ].filter(link => link.id && typeof link.id === 'string');

  if (!personDetails || !personContent || !personSocialMedia) {
    return <p className='min-h-screen'>Loading...</p>;
  }

  return (
    <motion.section initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}>
      <article className='w-11/12 md:w-4/5 xl:w-2/3 2xl:w-3/5 mx-auto my-3 text-blue-500 flex flex-col md:flex-row gap-4 items-center'>
        {imageLoading && (
          <div className="absolute inset-0 h-full w-full">
            <div className="h-[450px] w-[300px] rounded-md bg-gradient-to-r from-gray-100 to-gray-300 animate-pulse"></div>
          </div>
        )}
        {personDetails.profile_path || commonImage ? (
          <Image
            alt={personDetails.name}
            src={`https://image.tmdb.org/t/p/w500${personDetails.profile_path || commonImage}`}
            width={300}
            height={450}
            className={`object-cover rounded-lg min-w-80 max-w-96 h-auto ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
            quality={50}
            priority={true}
            decoding="async"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : (
          <div className="bg-gray-200 text-gray-400 min-w-[300px] h-[450px] flex flex-col items-center justify-center rounded-md">
            <span className="text-lg lg:text-xl font-bold text-center">{personDetails.name}</span>
            <span className="text-base lg:text-lg text-center">STREAMIX</span>
          </div>
        )}
        <div className='flex flex-col gap-3 lg:text-lg'>
          <h2 className='text-lg lg:text-xl xl:text-2xl font-bold'>{personDetails.name}</h2>
          <span>Birthday: <b>{formatDate(personDetails.birthday)}</b></span>
          {personDetails.deathday && <span>Deathday: <b>{formatDate(personDetails.deathday)}</b></span>}
          <span>Place of Birth: <b>{personDetails.place_of_birth}</b></span>
          <span>Gender: <b>{getGender(personDetails.gender)}</b></span>
          {personDetails.also_known_as.length > 0 && (
            <span>Also known as: <b>{personDetails.also_known_as.join(', ')}</b></span>
          )}
          <p>{personDetails.biography}</p>
          <ul className='flex gap-4 mt-4'>
            {personSocialMedia && socialMediaLinks.map((link, index) => (
              <motion.li key={index} whileHover={{ scale: 1.5 }}>
                <a href={link.url} target='_blank' rel='noopener noreferrer' className='text-2xl lg:text-3xl hover:text-blue-600 transition-colors'>
                  {link.icon}
                </a>
              </motion.li>
            ))}
          </ul>
        </div>
      </article>
      <article className="bg-blue-500 text-blue-50 p-3 rounded-md mx-5 mb-3">
        <h3 className='text-2xl text-center font-semibold mb-3'>Movie and TV Shows of {personDetails.name}</h3>
        <motion.div className="flex gap-4 w-full flex-wrap justify-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}>
          {personContent.map((item) => (
            <motion.div
              whileHover={{ scale: 1.05 }}
              key={item.id}
            >
              <HorizontalCard userId={userId} contentData={item as ContentData} />
            </motion.div>
          ))}
        </motion.div>
      </article>
    </motion.section>
  )
}

export default PersonPage;