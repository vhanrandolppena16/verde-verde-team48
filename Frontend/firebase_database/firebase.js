// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Firebase Project: final-verde-team48
    // const firebaseConfig = {
    //   apiKey: "AIzaSyCuuRkyQusCjAXy9kkbqZkF2rdzlG0L4i8",
    //   authDomain: "final-verde-team48.firebaseapp.com",
    //   databaseURL: "https://final-verde-team48-default-rtdb.firebaseio.com",
    //   projectId: "final-verde-team48",
    //   storageBucket: "final-verde-team48.firebasestorage.app",
    //   messagingSenderId: "847330993640",
    //   appId: "1:847330993640:web:b757033bb033d78cc9f05d",
    //   measurementId: "G-46JWNNQLG8"
    // };

// Firebase Project: team48-verde
  const firebaseConfig = {
      apiKey: "AIzaSyBpDp4pPn9ucNzO9wmYPhNyb0_qjiZU3AM",
      authDomain: "team48-verde-c2395.firebaseapp.com",
      databaseURL: "https://team48-verde-c2395-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId: "team48-verde-c2395",
      storageBucket: "team48-verde-c2395.firebasestorage.app",
      messagingSenderId: "256046721455",
      appId: "1:256046721455:web:64a9a42b96512639f7275a"
    };

// Firebase Project: manual-database
  // const firebaseConfig = {
  //   apiKey: "AIzaSyDetiOAy6PqK1G7Elnp2zX7Poyl9x4lsYs",
  //   authDomain: "trial-verde-firestore-realtime.firebaseapp.com",
  //   databaseURL: "https://trial-verde-firestore-realtime-default-rtdb.firebaseio.com",
  //   projectId: "trial-verde-firestore-realtime",
  //   storageBucket: "trial-verde-firestore-realtime.firebasestorage.app",
  //   messagingSenderId: "247643878009",
  //   appId: "1:247643878009:web:bc8d04fd5c2d9c13a21aa8",
  //   measurementId: "G-DV4ZVDKSCS"
  // };
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const authentication = getAuth(app);
const db = getFirestore(app);
const sensor_db = getDatabase(app);

// Google sign-in function
const provider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  const result = await signInWithPopup(authentication, provider);
  return result.user;
};

export { authentication, db, sensor_db, signInWithGoogle };
