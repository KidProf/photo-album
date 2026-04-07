import Image from 'next/image';

export default function Header() {
  return (
    <header className="flex justify-center items-center py-4 border-b border-gray-200 text-black">
      <Image src="/smile-black-transparent.png" alt="Memories Logo" width={32} height={32} className="mr-2" />
      <h1 className="font-bold text-xl">Happy&apos;s Photo Album</h1>
    </header>
  );
}