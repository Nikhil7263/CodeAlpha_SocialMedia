async function register(){

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!name || !email || !password){
        alert("All fields required");
        return;
    }

    const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if(res.ok){
        alert("Registered successfully");
        window.location.href = "login.html";
    }
    else{
        alert(data.message);
    }
}