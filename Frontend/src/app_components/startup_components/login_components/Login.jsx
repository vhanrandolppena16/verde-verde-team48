// Login.jsx

// Importing necessary hooks and modules
import React, { useState, useEffect } from 'react';   // React core and state/effect hooks
import { useNavigate } from "react-router-dom";       // Necessary for route navigations

// Importing Firebase authentication methods
import { signInWithEmailAndPassword } from "firebase/auth";
import { authentication, signInWithGoogle, db } from "../../../../firebase_database/firebase"; // Firebase config and auth instance
import { doc, getDoc, setDoc } from "firebase/firestore";

// Login component
const Login = () => {
  const navigate = useNavigate();                   // Used for redirecting user after login

  // State variables to store email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Function to handle login logic
  const handleLogIn = async () => {
    // Check for empty input fields
    if (!email || !password) {
      alert("Please fill in all the fields.");
      return;
    }

    // Simple regex to validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    try { 
      // Firebase authentication: sign in with email and password      
      await signInWithEmailAndPassword(authentication, email, password);
      console.log("Logged in successfully");
    } catch (error) {
      alert("❌ Login failed:\n" + error.message);              // Log error

    }                   
  };

  const handleGoogleLogin = async () => {
    try {
      const user = await signInWithGoogle();
      console.log("Google login successful:", user.email);

      // Optional: Save first-time user to Firestore
      const userDoc = await getDoc(doc(db, "Users", user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          username: user.displayName || "New User",
          company: "N/A"
        });
      }
    } catch (error) {
      alert("❌ Google login failed:\n" + error.message);
    }
  };  

  // Effect to check if user is already authenticated and redirect them
  useEffect(() => {
    // Changes tab name display
    document.title = "Login | Verde";
  
    const unsubscribe = authentication.onAuthStateChanged((user) => {
      if (user) {
        navigate("/dashboard");     // Redirect to dashboard if user is logged in
      }
    });

    // Cleanup function to remove listener on component unmount
    return () => unsubscribe();
  }, []);

  // JSX returned by the Login component
  return (
    <>
        {/* Form title */}
        <h2 className = "text-white text-2xl font-bold">
          Log In
        </h2>

        {/* Email input */}
        <input
          type = "email"
          placeholder = "Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)} // Update state on input
          className = "w-full max-w-sm px-4 py-2 border border-gray-300 rounded"
        />

        {/* Password input */}
        <input
          type = "password"
          placeholder = "Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)} // Update state on input
          className = "w-full max-w-sm px-4 py-2 border border-gray-300 rounded"
        />

        {/* Login button */}
        <button
          onClick={() => handleLogIn()}
          className = "w-full max-w-sm text-center bg-black text-white text-lg py-2 px-4 rounded-[15px] hover:bg-[#064918] transition"
        >
          Login
        </button>

        {/* Login using Gmail button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full max-w-sm bg-green-700 text-white py-2 px-4 rounded-[15px] hover:bg-[#064918] transition mt-2"
        >
          Sign in with Google
        </button>

        {/* Redirect to sign-up */}
        <p className = "text-sm">
          Haven't registered yet?{" "}
          <span
            onClick={() => navigate("/signup")} // Redirect to sign-up page
            className = "text-blue-500 underline cursor-pointer"
          >
            Sign Up
          </span>
        </p>

        {/* Back to welcome screen button */}
        <button
          onClick={() => navigate("/")} // Redirect to welcome screen
          className = "w-full max-w-sm text-center bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition"
        >
          Back
        </button>
    </>
  );
};

export default Login;
