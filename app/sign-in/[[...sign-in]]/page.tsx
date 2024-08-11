import { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import SignInForm from '@/components/SignIn/SignInForm';

export const metadata: Metadata = {
  title: 'Streamix: Sign In',
  description: "Sign in to Streamix and dive back into your favorite movies and web series. Enjoy seamless access to your personalized content with a secure and user-friendly login experience. Log in now!"
};

const Page = () => {
  const { userId } : { userId: string | null } = auth();
  if (userId) redirect('/');
    
  return (
    <main className="flex flex-col min-h-[90vh] py-2">
      <SignInForm/>
    </main>
  )
}

export default Page;