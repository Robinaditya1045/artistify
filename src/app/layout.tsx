import './globals.css';
import Navbar from '@/components/shared/Navbar';
import Providers from '@/components/providers/Providers';

export const metadata = {
  title: 'Artistify',
  description: 'A platform for artists to showcase and sell their work',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}