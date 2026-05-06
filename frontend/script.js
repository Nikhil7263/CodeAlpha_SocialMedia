const user = JSON.parse(localStorage.getItem("user"));

console.log("USER:", user);

if (!user) {
    window.location.href = "login.html";
}

const postsContainer = document.getElementById("posts");

// Show username
const usernameEl = document.getElementById("username");
if (usernameEl) {
    usernameEl.innerText = user.name;
}

/* FETCH POSTS */
async function fetchPosts() {
    try {
        const res = await fetch("http://localhost:5000/api/posts");

        if (!res.ok) throw new Error("Failed to fetch posts");

        const data = await res.json();

        if (!data.length) {
            postsContainer.innerHTML = "<p>No posts yet</p>";
            return;
        }

        postsContainer.innerHTML = data.map(post => {

            const isFollowing = user.following?.some(
                id => id.toString() === post.userId.toString()
            );

            return `
            <div class="post">

                <p>${post.content}</p>

               <div class="action-buttons">

    <button 
        class="follow-btn"
        onclick="toggleFollow('${post.userId}', ${isFollowing})"
    >
        ${
            post.userId.toString() === user.id
            ? "You"
            : isFollowing
                ? "Following"
                : "Follow"
        }
    </button>

    ${post.userId.toString() === user.id ? `
    <button 
        class="delete-btn"
        onclick="deletePost('${post._id}')"
    >
         Delete
    </button>
    ` : ""}

    <button 
        class="like-btn"
        onclick="likePost('${post._id}')"
    >
        ❤️ Like (${post.likes})
    </button>

    ${post.userId.toString() === user.id ? `
<button 
    class="edit-btn"
    onclick="editPost('${post._id}', \`${post.content}\`)"
>
    Edit
</button>
` : ""}

</div>
                    ${(post.comments || [])
                    .filter(c => c.text && c.text.trim() !== "")
                    .map(c => `<p>💬 ${c.text}</p>`)
                    .join("")}
                </div>

                <div class="comment-box">
                    <input id="comment-${post._id}" placeholder="Write a comment...">
                    <button onclick="addComment('${post._id}')">
                        Post
                    </button>
                </div>

            </div>
            `;
        }).join("");

    } catch (error) {
        alert("Error loading posts");
        console.log(error);
    }
}

/* CREATE POST */
async function createPost() {
    const input = document.getElementById("postInput");
    const content = input.value;

    if (!content.trim()) {
        alert("Post cannot be empty");
        return;
    }

    try {
        const res = await fetch("http://localhost:5000/api/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: user.id,
                content
            })
        });

        if (!res.ok) throw new Error("Post failed");

        input.value = "";
        fetchPosts();

    } catch (error) {
        alert("Error creating post");
        console.log(error);
    }
}

/* LIKE POST */
async function likePost(id) {
    try {
        const res = await fetch(`http://localhost:5000/api/posts/${id}/like`, {
            method: "PUT"
        });

        if (!res.ok) throw new Error("Like failed");

        fetchPosts();

    } catch (error) {
        alert("Error liking post");
        console.log(error);
    }
}


async function deletePost(id){

    const confirmDelete = confirm("Delete this post?");

    if (!confirmDelete) return;

    try {

        const res = await fetch(`http://localhost:5000/api/posts/${id}`, {
            method: "DELETE"
        });

        const data = await res.json();

        alert(data.message);

        fetchPosts();

    } catch (error) {

        alert("Error deleting post");
        console.log(error);

    }
}


async function editPost(id, oldContent){

    const newContent = prompt("Edit your post:", oldContent);

    if (!newContent || !newContent.trim()) return;

    try {

        const res = await fetch(`http://localhost:5000/api/posts/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                content: newContent
            })
        });

        const data = await res.json();

        alert(data.message);

        fetchPosts();

    } catch (error) {

        alert("Error editing post");
        console.log(error);

    }
}

/* ADD COMMENT */
async function addComment(id) {
    const inputEl = document.getElementById(`comment-${id}`);
    const text = inputEl.value;

    if (!text.trim()) {
        alert("Comment cannot be empty");
        return;
    }

    const res = await fetch(`http://localhost:5000/api/posts/${id}/comment`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            text
        })
    });

    const data = await res.json();

    if (!res.ok) {
        alert(data.message);
        return;
    }

    inputEl.value = "";
    fetchPosts();
}

/* FOLLOW / UNFOLLOW TOGGLE */
async function toggleFollow(targetId, isFollowing) {

    if (targetId === user.id) {
        alert("You cannot follow yourself");
        return;
    }

    try {

        const url = isFollowing
            ? "http://localhost:5000/api/follow/unfollow"
            : "http://localhost:5000/api/follow/follow";

        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userId: user.id,
                targetId
            })
        });

        const data = await res.json();

        if (!res.ok) {
            alert(data.message);
            return;
        }

        alert(data.message);

        // Update local user data
        if (isFollowing) {
            user.following = user.following.filter(id => id !== targetId);
        } else {
            user.following.push(targetId);
        }

        localStorage.setItem("user", JSON.stringify(user));

        fetchPosts();

    } catch (error) {
        alert("Server error");
        console.log(error);
    }
}

/* LOGOUT */
function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

/* DARK MODE */
function toggleDarkMode(){

    document.body.classList.toggle("dark-mode");

    // Save mode
    if(document.body.classList.contains("dark-mode")){
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
}

/* LOAD SAVED THEME */
if(localStorage.getItem("theme") === "dark"){
    document.body.classList.add("dark-mode");
}/* DARK MODE */
function toggleDarkMode(){

    document.body.classList.toggle("dark-mode");

    // Save mode
    if(document.body.classList.contains("dark-mode")){
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
}

/* LOAD SAVED THEME */
if(localStorage.getItem("theme") === "dark"){
    document.body.classList.add("dark-mode");
}

/* INITIAL LOAD */
fetchPosts();