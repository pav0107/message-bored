import Link from 'next/link';
import { auth } from '../utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function Nav() {
  const [user, loading] = useAuthState(auth);

  console.log(user);

  return (
    <nav className="flex items-center justify-between py-10">
      <Link href="/">
        <button className="text-lg font-medium">Message bored</button>
      </Link>
      <ul className="flex items-center gap-10">
        {!user && (
          <Link
            className="px-4 py-2 ml-8 text-sm font-medium text-white rounded-lg bg-cyan-500"
            href={'/auth/login'}
          >
            Join Now
          </Link>
        )}
        {user && (
          <div className="flex items-center gap-6">
            <Link href={'/post'}>
              <button className="px-4 py-2 text-sm font-medium text-white rounded-md bg-cyan-500">
                Post
              </button>
            </Link>
            <Link href={'/dashboard'}>
              <img
                className="w-12 rounded-full cursor-pointer"
                src={user.photoURL}
                alt="profile-photo"
              />
            </Link>
          </div>
        )}
      </ul>
    </nav>
  );
}
