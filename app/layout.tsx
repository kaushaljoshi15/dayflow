import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider, SignIn, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { Nav } from './components/nav';
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
  title: "Dayflow | Modern HRMS",
  description: "Streamline your workforce management.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // ⚠️ SECURITY NOTE: Move your 'pk_test' key to a .env.local file
    <ClerkProvider publishableKey="pk_test_dGhvcm91Z2gtcmVkZmlzaC00Ny5jbGVyay5hY2NvdW50cy5kZXYk">
      <html lang="en" className="h-full">
        <body
          // 👇 COLOR CHANGE: Background is now a very soft indigo, text is deep navy
          className={`${geistSans.variable} ${geistMono.variable} antialiased h-full bg-[#EEF2FF] text-indigo-950 selection:bg-indigo-500 selection:text-white`}
        >
          {/* STATE: SIGNED OUT */}
          <SignedOut>
            <div className="flex min-h-screen w-full">
              <div className="hidden lg:flex w-1/2 bg-indigo-600 flex-col justify-center px-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                <div className="relative z-10 text-white space-y-6">
                  <h1 className="text-6xl font-bold tracking-tighter">Dayflow.</h1>
                  <p className="text-xl text-indigo-100 max-w-md leading-relaxed">
                    The modern operating system for your workforce.
                  </p>
                </div>
              </div>
              <div className="flex-1 flex items-center justify-center bg-white p-8">
                <SignIn routing="hash" />
              </div>
            </div>
          </SignedOut>

          {/* STATE: SIGNED IN */}
          <SignedIn>
            <div className="min-h-screen flex flex-col bg-[#F5F7FF]"> {/* Soft Blue-ish Background */}
              {/* Navbar with Glass Effect */}
              <header className="sticky top-0 z-50 w-full border-b border-indigo-100 bg-white/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-8">
                      <a href="/" className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">D</div>
                        <span className="font-bold text-xl tracking-tight text-indigo-950">Dayflow</span>
                      </a>
                      <div className="hidden md:block h-6 w-px bg-indigo-100 mx-2"></div>
                      <Nav />
                    </div>
                    <div className="flex items-center gap-4">
                      <UserButton 
                        appearance={{
                          elements: {
                            avatarBox: "h-9 w-9 ring-2 ring-indigo-50"
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </header>
              
              <main className="flex-1 container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                {children}
              </main>
            </div>
          </SignedIn>
        </body>
      </html>
    </ClerkProvider>
  );
}