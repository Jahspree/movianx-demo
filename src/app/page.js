'use client';
import dynamic from 'next/dynamic';

const Movianx = dynamic(() => import('./Movianx'), { ssr: false });

export default function Home() {
  return <Movianx />;
}
