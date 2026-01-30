import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from "./providers/authProvider";
import NextTopLoader from 'nextjs-toploader';
import ModalProvider from "./providers/modalProvider";
import { getProfile } from "./lib/userServer";
import ToastProvider from "./providers/toastProvider";
import 'react-toastify/dist/ReactToastify.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Biasly",
  description: "Next Generation K-POP Photocards Platform",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await getProfile()

  return (
    <html lang="en">
      <meta name="apple-mobile-web-app-title" content="Biasly" />
      <body
        suppressHydrationWarning={true}
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserProvider initialUser={session?.profile ?? null}>
          <ModalProvider>
            <ToastProvider>
            <main>
              <NextTopLoader
                color="#ec4899"     /* Pink-500 (Matches your theme) */
                initialPosition={0.08}
                crawlSpeed={200}
                height={3}          /* A nice visible thickness */
                crawl={true}
                showSpinner={false} /* False, because we have your custom loader */
                easing="ease"
                speed={200}
                shadow="0 0 10px #ec4899,0 0 5px #ec4899" /* Neon Glow Effect */
                zIndex={99999}
              />
              {children}
            </main>
            </ToastProvider>
          </ModalProvider>
        </UserProvider>
      </body>
    </html>
  );
}
