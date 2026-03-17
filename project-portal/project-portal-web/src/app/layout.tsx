import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { FarmerProvider } from '@/contexts/FarmerContext';
import { Toaster } from 'sonner';
import ToastContainer from '@/components/ui/Toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CarbonScribe Project Portal - Farmer Dashboard',
  description: 'Manage your regenerative agriculture projects and carbon credits',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={`${inter.className} bg-linear-to-br from-emerald-50 via-white to-cyan-50 min-h-screen`}>
        <FarmerProvider>
          <Toaster position="top-right" richColors closeButton />
          <ToastContainer />
          {children}
        </FarmerProvider>
      </body>
    </html>
  );
}
