import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider, SignIn, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'; // ✅ 1. Import Clerk
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dayflow HRMS",
  description: "HR Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // ✅ 2. Wrap the whole app in ClerkProvider
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {/* ✅ 3. If User is SIGNED OUT: Show the Login Box centered */}
          <SignedOut>
            <div className="flex h-screen w-full items-center justify-center bg-gray-100">
              <SignIn routing="hash" />
            </div>
          </SignedOut>

          {/* ✅ 4. If User is SIGNED IN: Show the App + a User Button */}
          <SignedIn>
            <div className="min-h-screen flex flex-col">
              {/* Optional: A simple top bar with the User Profile/Logout button */}
              <header className="p-4 border-b flex justify-between items-center bg-white shadow-sm">
                <span className="font-bold text-lg">Dayflow</span>
                <UserButton />
              </header>
              
              {/* This renders your page.tsx */}
              <main className="flex-1">
                {children}
              </main>
            </div>
          </SignedIn>
        </body>
      </html>
    </ClerkProvider>
  );
}