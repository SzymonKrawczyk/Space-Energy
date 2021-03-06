// Author: Szymon Krawczyk

// Import the functions from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-app.js";
import { getFirestore, getDoc, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-firestore.js";

let Firebase = {};

// Firebase configuration
Firebase.firebaseConfig = {

    apiKey: "AIzaSyA8eDUFESiFSBfWAyySM60i27HEW9-c6No",
    authDomain: "space-energy.firebaseapp.com",
    projectId: "space-energy",
    storageBucket: "space-energy.appspot.com",
    messagingSenderId: "320646880540",
    appId: "1:320646880540:web:9b9bb8afe678ecf9dcaed9"
};

// Initialize Firebase
Firebase.app = initializeApp(Firebase.firebaseConfig);
Firebase.db = getFirestore(Firebase.app);

// Firebase.getCollection = async () => {

//     const docRef = collection(Firebase.db, 'gameData');
//     const dataSnapshot = await getDocs(docRef);
//     const dataList = dataSnapshot.docs.map(doc => doc.data());
//     return dataList;
// }

Firebase.getDocument = async () => {

    const docRef = doc(Firebase.db, 'gameData', 'highScore');

    console.log("Getting document...");

    const docSnap = await getDoc(docRef);


    if (docSnap.exists()) {

        console.log(`Doc: ${docSnap.data().name} ${docSnap.data().score}`);

        return {
              name: docSnap.data().name
            , score: docSnap.data().score
        };

    } else {

        console.log(`No doc!`);

        return {
              name: "Unknown"
            , score: -1
        };
    }
}

Firebase.setDocument = async (newName, newScore) => {

    console.log("Setting highScore...");

    const newDoc = {
          name: newName
        , score: newScore
    }

    console.log(`newDoc: ${newDoc.name} ${newDoc.score}`);

    console.log("Checking if highscore...");

    const oldDoc = await Firebase.getDocument();

    console.log(`oldDoc: ${oldDoc.name} ${oldDoc.score}`);

    if(oldDoc.score >= newDoc.score) return;

    const docRef = doc(Firebase.db, 'gameData', 'highScore');

    await setDoc(docRef, newDoc, { merge: true });

    console.log("newDoc uploaded!");
} 

// Export Firebase (attach to window global variable)
window.Firebase = Firebase;
