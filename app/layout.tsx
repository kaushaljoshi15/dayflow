import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider, SignIn, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'; 
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
    // 👇 KEY FIX: PASTE YOUR ACTUAL 'pk_test_...' KEY INSIDE THE QUOTES BELOW
    <ClerkProvider publishableKey="pk_test_YOUR_ACTUAL_LONG_KEY_HERE">
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {/* If User is SIGNED OUT: Show the Login Box centered */}
          <SignedOut>
            <div className="flex h-screen w-full items-center justify-center bg-gray-100">
              <SignIn routing="hash" />
            </div>
          </SignedOut>

          {/* If User is SIGNED IN: Show the App + a User Button */}
          <SignedIn>
            <div className="min-h-screen flex flex-col">
              <header className="p-4 border-b flex justify-between items-center bg-white shadow-sm">
                <span className="font-bold text-lg">Dayflow</span>
                <UserButton />
              </header>
              
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