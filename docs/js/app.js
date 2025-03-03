import { 
    initializeApp 
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";

import { 
    getFirestore, collection, addDoc, onSnapshot, 
    orderBy, query, doc, updateDoc, deleteDoc, getDoc 
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

// Firebase Configuration
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

// Get User IP
async function getUserIP() {
    let response = await fetch("https://api64.ipify.org?format=json");
    let data = await response.json();
    return data.ip;
}

// Function to Post a Message
async function postMessage(category) {
    let userName = document.getElementById("userName").value;
    let postTitle = document.getElementById("postTitle").value;
    let messageText = document.getElementById("messageText").value;
    let userIP = await getUserIP();

    if (!userName || !postTitle || !messageText) {
        alert("Please enter all fields!");
        return;
    }

    addDoc(collection(db, category), {
        name: userName,
        title: postTitle,
        message: messageText,
        timestamp: new Date(),
        likes: 0,
        dislikes: 0,
        userIP: userIP
    }).then(() => {
        alert("Message Posted!");
        location.reload();
    }).catch(error => {
        console.error("Error posting message:", error);
    });
}

// Function to React to a Post
async function reactToPost(category, docId, reaction) {
    let userIP = await getUserIP();
    let postRef = doc(db, category, docId);
    let post = await getDoc(postRef);

    if (!post.exists()) return;
    let postData = post.data();

    if (postData.userIP === userIP) {
        alert("You can only react once per post!");
        return;
    }

    let updateData = {};
    if (reaction === "like") updateData.likes = postData.likes + 1;
    if (reaction === "dislike") updateData.dislikes = postData.dislikes + 1;

    await updateDoc(postRef, updateData);
}

// Function to Delete Post
async function deletePost(category, docId) {
    let userIP = await getUserIP();
    let postRef = doc(db, category, docId);
    let post = await getDoc(postRef);

    if (!post.exists()) return;
    let postData = post.data();

    if (postData.userIP !== userIP) {
        alert("You can only delete your own post!");
        return;
    }

    await deleteDoc(postRef);
    alert("Post deleted!");
}

// Function to Load Messages
function loadMessages(category) {
    let container = document.getElementById("messages-container");
    const q = query(collection(db, category), orderBy("timestamp", "desc"));

    onSnapshot(q, (snapshot) => {
        container.innerHTML = "";
        snapshot.forEach((doc) => {
            let data = doc.data();
            container.innerHTML += `
                <div class="post">
                    <h3>${data.title}</h3>
                    <p><strong>${data.name}:</strong> ${data.message}</p>
                    <button onclick="reactToPost('${category}', '${doc.id}', 'like')">👍 ${data.likes}</button>
                    <button onclick="reactToPost('${category}', '${doc.id}', 'dislike')">👎 ${data.dislikes}</button>
                    <button onclick="deletePost('${category}', '${doc.id}')">🗑 Delete</button>
                </div>
            `;
        });
    });
}

// Load Messages Based on Page
if (window.location.pathname.includes("feedback.html")) {
    loadMessages("feedback");
} else if (window.location.pathname.includes("general.html")) {
    loadMessages("general");
} else if (window.location.pathname.includes("offtopic.html")) {
    loadMessages("offtopic");
}

// Make Functions Accessible in HTML
window.postMessage = postMessage;
window.reactToPost = reactToPost;
window.deletePost = deletePost;
