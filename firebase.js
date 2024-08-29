// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { isSupported } from "firebase/analytics";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAfa6TnCKYF5g2oG3NfDf6L1CVBsje6nxc",
    authDomain: "inventory-management-96eaa.firebaseapp.com",
    projectId: "inventory-management-96eaa",
    storageBucket: "inventory-management-96eaa.appspot.com",
    messagingSenderId: "1080019332704",
    appId: "1:1080019332704:web:cb18a0022f90bafdf1dd05",
    measurementId: "G-SRRGNZ684C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
const firestore = getFirestore(app)


export { firestore }

