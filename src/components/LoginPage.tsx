import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signInWithGoogle, signOutUser, auth } from "../firebase/firebaseConfig";
import { setUser, clearUser } from "../redux/userSlice";
import { RootState } from "../redux/store";
import { onAuthStateChanged } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { FaSignOutAlt } from "react-icons/fa";

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        dispatch(
          setUser({
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            email: currentUser.email,
            photoURL: currentUser.photoURL,
          })
        );
        navigate("/home");
      } else {
        dispatch(clearUser());
      }
    });
  
    return () => unsubscribe();
  }, [dispatch, navigate]);
  

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 flex items-center justify-center bg-purple-50 p-6">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
        <h1 className="text-4xl font-bold text-purple-600 mb-10">TaskBuddy</h1>
        <p className="text-gray-600 mb-6">
          Streamline your workflow and track progress effortlessly.
        </p>

        {user ? (
          <div className="flex flex-col items-center">
            {/* Profile Section */}
            <div className="flex items-center gap-3 mb-4">
              <img
                src={user.photoURL || "https://via.placeholder.com/40"}
                alt="Profile"
                className="w-10 h-10 rounded-full border"
              />
              <span className="text-gray-800 font-medium">{user.displayName || "User"}</span>
            </div>
            {/* Logout Button */}
            <button
              onClick={() => signOutUser()}
              className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-all"
            >
              <FaSignOutAlt className="text-lg" />
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => signInWithGoogle()}
            className="flex items-center justify-center gap-3 px-6 py-3 w-full bg-white border border-gray-300 rounded-lg shadow-md hover:bg-gray-100 transition-all"
          >
            <FcGoogle className="text-2xl" />
            <span className="text-gray-700 font-medium">Continue with Google</span>
          </button>
        )}
      </div>
      </div>
      <div className="flex-1 bg-purple-50 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <g className="animate-[spin_20s_linear_infinite]">
                <circle cx="100" cy="100" r="80" stroke="#8B5CF6" strokeWidth="0.5" fill="none" opacity="0.2"/>
              </g>
              <g className="animate-[spin_15s_linear_infinite]">
                <circle cx="100" cy="100" r="60" stroke="#8B5CF6" strokeWidth="0.5" fill="none" opacity="0.4"/>
              </g>
              <g className="animate-[spin_10s_linear_infinite]">
                <circle cx="100" cy="100" r="40" stroke="#8B5CF6" strokeWidth="0.5" fill="none" opacity="0.6"/>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
