import { auth, db } from '../utils/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { toast } from 'react-toastify';

export default function Post() {
  // Form state
  const [post, setPost] = useState({ description: '' });
  const [user, loading] = useAuthState(auth);
  const route = useRouter();
  const routeData = route.query;

  // Submit Post
  const submitPost = async (e) => {
    e.preventDefault();

    // Run checks for description
    if (!post.description) {
      toast.error('Description field empty', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return;
    }
    if (post.description.length > 300) {
      toast.error('Description too long', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return;
    }

    if (post?.hasOwnProperty('id')) {
      const docRef = doc(db, 'posts', post.id);
      const updatedPost = { ...post, timestamp: serverTimestamp() };
      await updateDoc(docRef, updatedPost);
      return route.push('/');
    } else {
      // Make a new post
      const collectionRef = collection(db, 'posts');
      await addDoc(collectionRef, {
        ...post,
        timestamp: serverTimestamp(),
        user: user.uid,
        avatar: user.photoURL,
        username: user.displayName,
      });
      setPost({ description: '' });
      toast.success('Post has been made!', {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return route.push('/');
    }
  };

  // Check user
  const checkUser = async () => {
    if (loading) return;
    if (!user) route.push('/auth/login');
    if (routeData.id) {
      setPost({ description: routeData.description, id: routeData.id });
    }
  };

  useEffect(() => {
    checkUser();
  }, [user, loading]);

  return (
    <div className="max-w-md p-12 mx-auto my-20 rounded-lg shadow-lg">
      <form onSubmit={submitPost}>
        <h1 className="text-2xl font-bold">
          {post.hasOwnProperty('id') ? 'Edit your post' : 'Create a new post'}
        </h1>
        <div className="py-2">
          <h3 className="py-2 text-lg font-medium">Description</h3>
          <textarea
            value={post.description}
            onChange={(e) => setPost({ ...post, description: e.target.value })}
            className="w-full h-48 p-2 text-sm text-white bg-gray-800 rounded-lg"
          ></textarea>
          <p
            className={`text-cyan 600 font-medium text-sm ${
              post.description.length > 300 ? 'text-red-600' : ''
            }`}
          >
            {post.description.length}/300
          </p>
        </div>
        <button
          type="submit"
          className="w-full p-2 my-2 text-sm font-medium text-white rounded-lg bg-cyan-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
