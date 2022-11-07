import Link from 'next/link';

export default function Nav() {
  return (
    <nav className="flex items-center justify-between py-10">
      <Link href="/">
        <button className="text-lg font-medium">Message bored</button>
      </Link>
      <ul className="flex items-center gap-10">
        <Link
          className="px-4 py-2 ml-8 text-sm font-medium text-white rounded-lg bg-cyan-500"
          href={'/auth/login'}
        >
          Join Now
        </Link>
      </ul>
    </nav>
  );
}
