import type { Metadata } from "next";
import { Inter} from "next/font/google";
import "./globals.css";
import Navbar from "@/components/reduced/Navbar";
import { ClerkProvider } from '@clerk/nextjs'
import Footer from "@/components/reduced/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Streamix: Your Ultimate Destination for Movies and Web Series",
  description: "Streamix offers endless entertainment with a vast library of movies and web series. Enjoy a secure, responsive experience with trending content at your fingertips. Join now!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={inter.className}>
        <main className="bg-blue-50 w-full min-h-screen">
          <Navbar/>
          {children}
          <Footer/>
        </main>
      </body>
    </html>
    </ClerkProvider>
  );
}
