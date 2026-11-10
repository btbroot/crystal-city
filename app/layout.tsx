import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
 title: 'Crystal City — A little exploration. A lot of you.',
 description: 'Wander the pixel-art streets of Mosswick, find rare crystals, and discover your next favorite look in an ever-changing collection of local shops.',
 icons: { icon: '/favicon.svg', shortcut: '/favicon.svg' },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {return <html lang="en"><body>{children}</body></html>;}
