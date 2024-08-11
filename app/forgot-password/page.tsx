import { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import ForgotPasswordFlow from '@/components/forgot-password/ForgotPasswordFlow';

export const metadata: Metadata = {
    title: 'Streamix: Forgot Password',
    description: "Forgot your Streamix password? Easily reset it and regain access to your favorite movies and web series. Follow the simple steps to restore your account securely. Get back to streaming in no time!"
};

const Page = () => {
    const { userId }: { userId: string | null } = auth();
    if (userId) redirect('/');

    return (
        <main className="flex flex-col min-h-[90vh] py-2">
            <ForgotPasswordFlow/>
        </main>
    )
}

export default Page
