import { supabase } from "./supabase.js";

// 🔹 Volunteer Registration
document.getElementById("registerForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const age = parseInt(document.getElementById("age").value.trim(), 10); // Ensure integer
    const address = document.getElementById("address").value.trim();
    const skills = document.getElementById("skills").value.trim();
    const equipments = document.getElementById("equipments").value.trim();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    // 🔹 Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        alert("Password must be at least 8 characters and include uppercase, lowercase, number, and special character.");
        return;
    }

    // 🔹 Check if username already exists
    const { data: existingUser } = await supabase
        .from("volunteers")
        .select("username")
        .eq("username", username)
        .single();

    if (existingUser) {
        alert("Username already exists. Choose a different one.");
        return;
    }

    // 🔹 Hash the password before storing (bcrypt is recommended for production)
    const hashedPassword = btoa(password); // Base64 encoding (not secure for production)

    // 🔹 Insert user data into Supabase
    const { data, error } = await supabase
        .from("volunteers")
        .insert([{ 
            full_name: fullName, 
            age, 
            address, 
            skills, 
            equipments, 
            username, 
            password: hashedPassword 
        }]);

    if (error) {
        console.error("Error inserting data:", error);
        alert("Error: " + error.message);
    } else {
        console.log("Registration successful:", data);
        alert("Registration successful! Redirecting to login...");
        window.location.href = "login.html";
    }
});

// 🔹 Volunteer Login
document.getElementById("loginForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("loginUsername").value.trim();
    const password = document.getElementById("loginPassword").value;
    const hashedPassword = btoa(password); // Encode password for comparison

    const { data, error } = await supabase
        .from("volunteers")
        .select("*")
        .eq("username", username)
        .eq("password", hashedPassword) // Match hashed password
        .single();

    if (error || !data) {
        alert("Invalid username or password");
        console.error("Login error:", error);
    } else {
        console.log("Login successful:", data);
        alert("Login successful! Redirecting...");
        window.location.href = "dashboard.html";
    }
});
