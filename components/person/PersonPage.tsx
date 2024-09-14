"use client"
import React, { useCallback } from 'react'
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaFacebook, FaInstagram, FaTiktok, FaTwitter, FaYoutube } from 'react-icons/fa';
import HorizontalCard from '../movies/HorizontalCard';

interface PersonDetails {
  id: number;
  name: string;
  biography: string;
  birthday: string;
  also_known_as: string[];
  gender: number;
  deathday: string | null;
  place_of_birth: string;
  profile_path: string;
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
  personDetails: PersonDetails;
  personContent: ContentData[];
  personSocialMedia: SocialMedia;
}

const PersonPage = ({ userId, personDetails, personContent, personSocialMedia }: PersonDetailsProps) => {

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

  const socialMediaLinks = [
    { platform: 'Facebook', id: personSocialMedia?.facebook_id, url: `https://facebook.com/${personSocialMedia?.facebook_id}`, icon: <FaFacebook /> },
    { platform: 'Instagram', id: personSocialMedia?.instagram_id, url: `https://instagram.com/${personSocialMedia?.instagram_id}`, icon: <FaInstagram /> },
    { platform: 'TikTok', id: personSocialMedia?.tiktok_id, url: `https://tiktok.com/@${personSocialMedia?.tiktok_id}`, icon: <FaTiktok /> },
    { platform: 'Twitter', id: personSocialMedia?.twitter_id, url: `https://twitter.com/${personSocialMedia?.twitter_id}`, icon: <FaTwitter /> },
    { platform: 'YouTube', id: personSocialMedia?.youtube_id, url: `https://youtube.com/${personSocialMedia?.youtube_id}`, icon: <FaYoutube /> }
  ].filter(link => link.id && typeof link.id === 'string');

  return (
    <>
      <motion.section className='w-11/12 sm:w-4/5 md:w-3/4 xl:w-2/3 2xl:w-3/5 mx-auto my-3 text-blue-500 flex gap-4 items-center' initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}>
        <Image priority={true} alt={personDetails.name} src={`https://image.tmdb.org/t/p/w500${personDetails.profile_path}`} width={300} height={450} className='object-cover rounded-lg min-w-80 max-w-96 h-auto' />
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
      </motion.section>
      <section className="bg-blue-500 text-blue-50 p-3 rounded-md mx-5 mb-3">
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
      </section>
    </>
  )
}

export default PersonPage