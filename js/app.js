// Firebase Configuration (Replace with your Firebase Project Config)
const firebaseConfig = {
    apiKey: "YOUR-API-KEY",
    authDomain: "YOUR-DOMAIN.firebaseapp.com",
    projectId: "YOUR-PROJECT-ID",
    storageBucket: "YOUR-BUCKET.appspot.com",
    messagingSenderId: "YOUR-SENDER-ID",
    appId: "YOUR-APP-ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Fetch and Display Posts
function loadPosts() {
    db.collection("posts").get().then((querySnapshot) => {
        let container = document.getElementById("posts-container");
        container.innerHTML = "";
        querySnapshot.forEach((doc) => {
            let post = doc.data();
            container.innerHTML += `<div><h2><a href="post.html?id=${doc.id}">${post.title}</a></h2></div>`;
        });
    });
}

// Submit New Post
function submitPost() {
    let title = document.getElementById("postTitle").value;
    let content = document.getElementById("postContent").value;

    db.collection("posts").add({ title: title, content: content }).then(() => {
        alert("Post Created!");
        window.location.href = "index.html";
    });
}

// Load Post Details & Replies
function loadPost() {
    let params = new URLSearchParams(window.location.search);
    let postId = params.get("id");

    db.collection("posts").doc(postId).get().then((doc) => {
        let post = doc.data();
        document.getElementById("post-content").innerHTML = `<h1>${post.title}</h1><p>${post.content}</p>`;
    });

    // Load Replies
    db.collection("posts").doc(postId).collection("replies").get().then((querySnapshot) => {
        let container = document.getElementById("replies-container");
        querySnapshot.forEach((doc) => {
            let reply = doc.data();
            container.innerHTML += `<p>${reply.text}</p>`;
        });
    });
}

// Submit Reply
function submitReply() {
    let replyText = document.getElementById("replyText").value;
    let params = new URLSearchParams(window.location.search);
    let postId = params.get("id");

    db.collection("posts").doc(postId).collection("replies").add({ text: replyText }).then(() => {
        alert("Reply Submitted!");
        location.reload();
    });
}

// Load Posts on Home Page
if (window.location.pathname.includes("index.html")) {
    loadPosts();
}
