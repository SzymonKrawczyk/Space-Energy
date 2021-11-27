// Author: Szymon Krawczyk

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-app.js";
import { getFirestore, collection, getDocs, getDoc, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-firestore.js";


let Firebase = {};

// Your web app's Firebase configuration
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

Firebase.getCollection = async () => {

    const docRef = collection(Firebase.db, 'test');
    const dataSnapshot = await getDocs(docRef);
    const dataList = dataSnapshot.docs.map(doc => doc.data());
    return dataList;
}

Firebase.getDocument = async (docID) => {

    const docRef = doc(Firebase.db, 'test', docID);

    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {

        return docSnap.data();

    } else {

        return {score: 0};
    }
}

Firebase.setDocument = async (docID, newDoc) => {

    const docRef = doc(Firebase.db, 'test', docID);
    await setDoc(docRef, newDoc, { merge: true });
} 

//export (attach to window global variable)
window.Firebase = Firebase;



//TODO - firebase, game code
    // //get score
    // (async () => {

    //     if(typeof(device.uuid) == 'undefined' || device.uuid == null) device.uuid = "Unknown";

    //     let dbDocument = await window.Firebase.getDocument(device.uuid);

    //     highScore = dbDocument.score;

    //     gameObjects[GLOBAL.layers.UI].getObjectAt(0).setText(highScore);

    // }) ();


    //TODO
    // //save score   

    // const saveScore = async () => {

    //     let name = prompt("New highscore!\n\rPlease enter your name", "Unknown");
    //     if (name == null || name == "") {
    //         name = "Unknown";
    //     }

    //     //console.log(navigator);
    //     navigator.vibrate(1000);

    //     let temp = currentScore;
    //     highScore = temp;
    //     gameObjects[UI].getObjectAt(0).setText(highScore);
            
    //     //if(typeof(device.uuid) == 'undefined' || device.uuid == null) device.uuid = "browser_debug";

    //     let dbDocument = await window.Firebase.getDocument(name);

    //     dbDocument.score = temp;
    //     await window.Firebase.setDocument(name, dbDocument);
    // }

    // document.addEventListener("keydown", function (e) {

    //     if (e.keyCode === 32) {

    //         saveScore();

    //     }
    // });

    // document.getElementById('gameCanvas').addEventListener("touchstart", (event)=>{

    //     saveScore();
    // });
