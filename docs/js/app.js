// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, orderBy, query } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Firebase Configuration (Your Credentials)
const firebaseConfig = {
    apiKey: "AIzaSyDJ3YeFV0W-UFt-WKD_8lh0RliEQE3lgpw",
    authDomain: "forumhome-c9e0a.firebaseapp.com",
    projectId: "forumhome-c9e0a",
    storageBucket: "forumhome-c9e0a.appspot.com",
    messagingSenderId: "492916848174",
    appId: "1:492916848174:web:b2d81dfeb3372ae61f11bf",
    measurementId: "G-08J3516M5L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to Post a Message
function postMessage(category) {
    let userName = document.getElementById("userName").value;
    let messageText = document.getElementById("messageText").value;

    if (!userName || !messageText) {
        alert("Please enter your name and message before posting!");
        return;
    }

    addDoc(collection(db, category), {
        name: userName,
        message: messageText,
        timestamp: new Date()
    }).then(() => {
        alert("Message Posted!");
        location.reload();
    }).catch(error => {
        console.error("Error posting message:", error);
    });
}

// Function to Load Messages for a Category
function loadMessages(category) {
    let container = document.getElementById("messages-container");
    const q = query(collection(db, category), orderBy("timestamp", "desc"));

    onSnapshot(q, (snapshot) => {
        container.innerHTML = "";
        snapshot.forEach((doc) => {
            let data = doc.data();
            container.innerHTML += `<p><strong>${data.name}:</strong> ${data.message}</p>`;
        });
    });
}

// Automatically Load Messages for the Current Page
if (window.location.pathname.includes("feedback.html")) {
    loadMessages("feedback");
} else if (window.location.pathname.includes("general.html")) {
    loadMessages("general");
} else if (window.location.pathname.includes("offtopic.html")) {
    loadMessages("offtopic");
}

// Make Functions Accessible in HTML
window.postMessage = postMessage;
