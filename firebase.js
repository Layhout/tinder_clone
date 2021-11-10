// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB88cHsfXcOyz761QPq0_4oSKOJ9BZ0UlI",
    authDomain: "test-with-react-5c0ff.firebaseapp.com",
    databaseURL: "https://test-with-react-5c0ff-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "test-with-react-5c0ff",
    storageBucket: "test-with-react-5c0ff.appspot.com",
    messagingSenderId: "251317291067",
    appId: "1:251317291067:web:f270c3bd51fe620183341e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export { auth, db };