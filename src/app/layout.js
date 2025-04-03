import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'CodeEnv - Python Coding Environment',
  description: 'Online Python coding environment for interviews and practice',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&display=swap" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}