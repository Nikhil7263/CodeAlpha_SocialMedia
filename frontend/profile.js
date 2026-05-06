const user = JSON.parse(localStorage.getItem("user"));

console.log("PROFILE USER:", user);

if (!user) {
    window.location.href = "login.html";
}

// User Info
document.getElementById("profileName").innerText = user.name;
document.getElementById("profileEmail").innerText = user.email;

// Following Count
document.getElementById("followingCount").innerText =
    user.following?.length || 0;

// Followers Count (temporary)
document.getElementById("followersCount").innerText =
    user.followers?.length || 0;

// Fetch My Posts
async function fetchMyPosts() {

    try {

        const res = await fetch("http://localhost:5000/api/posts");

        const posts = await res.json();

        const myPosts = posts.filter(
            post => post.userId.toString() === user.id
        );

        document.getElementById("myPosts").innerHTML =
            myPosts.map(post => `
            
            <div class="post">
                <p>${post.content}</p>
                <p>❤️ ${post.likes} Likes</p>
            </div>

        `).join("");

    } catch (error) {
        console.log(error);
    }
}

fetchMyPosts();