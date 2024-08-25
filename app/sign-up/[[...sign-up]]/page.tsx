import { Metadata } from 'next';
import SignUpFlow from '@/components/SignUp/SignUpFlow'
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Streamix: Sign Up',
  description: 'Create a new account and securely access your favorite movies and web series. Join now!',
};

const Page = () => {
  const { userId } : { userId: string | null } = auth();
  if (userId) redirect('/');
  return (
    <main className="flex flex-col min-h-[90vh] py-5">
    <SignUpFlow />
    </main>
  )
}

export default Page;