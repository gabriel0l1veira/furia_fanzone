import type {Metadata} from 'next';
import { GeistSans, GeistMono } from 'geist/font'; // Correct import path
import './globals.css';
import { Toaster } from '@/components/ui/toaster'; // Import Toaster

export const metadata: Metadata = {
  title: 'Furia Fan Zone', // Updated title
  description: 'Acompanhe e interaja com a torcida da FURIA em tempo real!', // Updated description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR"> {/* Changed lang to Portuguese Brazil */}
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased dark`}> {/* Add dark class, removed font variables from class */}
        {children}
        <Toaster /> {/* Add Toaster component */}
      </body>
    </html>
  );
}
