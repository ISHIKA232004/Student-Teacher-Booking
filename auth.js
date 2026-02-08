// ============================================
// AUTHENTICATION HANDLER
// ============================================

// Check if user is logged in
function checkAuthState() {
    auth.onAuthStateChanged((user) => {
        if (user) {
            // User is logged in
            console.log("✅ User logged in:", user.email);
            
            // Get user type from Firestore
            db.collection("users").doc(user.uid).get()
                .then((doc) => {
                    if (doc.exists) {
                        const userData = doc.data();
                        console.log("👤 User type:", userData.type);
                        
                        // Store user info in localStorage
                        localStorage.setItem("user", JSON.stringify({
                            uid: user.uid,
                            email: user.email,
                            type: userData.type,
                            name: userData.name || user.email
                        }));
                    }
                })
                .catch((error) => {
                    console.error("Error getting user data:", error);
                });
        } 
        // else {
        //     // User is logged out
        //     console.log("❌ No user logged in");
        //     localStorage.removeItem("user");
        // }
        else {
    console.log("❌ No user logged in");
    // DO NOT remove localStorage automatically
    // localStorage.removeItem("user");
}
    });
}

// Call this function when page loads
checkAuthState();

// Register new user
async function registerUser(email, password, userData) {
    try {
        console.log("📝 Registering user:", email);
        
        // 1. Create user with Firebase Authentication
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        console.log("✅ User created in Firebase Auth:", user.uid);
        
        // 2. Add user data to Firestore
        await db.collection("users").doc(user.uid).set({
            email: email,
            name: userData.name,
            type: userData.type, // "student", "teacher", or "admin"
            department: userData.department || "",
            subject: userData.subject || "",
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        console.log("✅ User data saved to Firestore");
        
        // Log the action
        logAction("USER_REGISTERED", user.uid, { 
            email: email, 
            userType: userData.type 
        });
        
        return { success: true, message: "Registration successful!" };
        
    } catch (error) {
        console.error("❌ Registration error:", error.message);
        
        // Log the error
        logAction("REGISTRATION_FAILED", null, { 
            email: email, 
            error: error.message 
        });
        
        return { 
            success: false, 
            message: getErrorMessage(error.code) 
        };
    }
}

// Login user
async function loginUser(email, password) {
    try {
        console.log("🔑 Logging in user:", email);
        
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;
        
        console.log("✅ Login successful for:", user.email);
        
        // Log the action
        logAction("USER_LOGGED_IN", user.uid, { email: email });
        
        return { success: true, user: user };
        
    } catch (error) {
        console.error("❌ Login error:", error.message);
        
        // Log the error
        logAction("LOGIN_FAILED", null, { 
            email: email, 
            error: error.message 
        });
        
        return { 
            success: false, 
            message: getErrorMessage(error.code) 
        };
    }
}

// Logout user
function logoutUser() {
    console.log("🚪 Logging out user");
    
    // Get current user before logging out
    const currentUser = auth.currentUser;
    const userEmail = currentUser ? currentUser.email : "unknown";
    
    auth.signOut()
        .then(() => {
            console.log("✅ Logout successful");
            localStorage.removeItem("user");
            
            // Log the action
            logAction("USER_LOGGED_OUT", currentUser?.uid || null, { email: userEmail });
            
            // Redirect to login page
            window.location.href = "../pages/login.html";
        })
        .catch((error) => {
            console.error("❌ Logout error:", error);
        });
}

// Get user-friendly error messages
function getErrorMessage(errorCode) {
    const errorMessages = {
        "auth/email-already-in-use": "This email is already registered.",
        "auth/invalid-email": "Please enter a valid email address.",
        "auth/operation-not-allowed": "Email/password login is not enabled.",
        "auth/weak-password": "Password should be at least 6 characters.",
        "auth/user-disabled": "This account has been disabled.",
        "auth/user-not-found": "No account found with this email.",
        "auth/wrong-password": "Incorrect password.",
        "auth/too-many-requests": "Too many attempts. Try again later."
    };
    
    return errorMessages[errorCode] || "An error occurred. Please try again.";
}

// Simple logging function (we'll enhance this later)
function logAction(action, userId, details) {
    const logEntry = {
        action: action,
        userId: userId || "anonymous",
        timestamp: new Date().toISOString(),
        details: details || {}
    };
    
    console.log("📝 ACTION LOG:", logEntry);
    
    // Save to Firestore logs collection
    db.collection("logs").add(logEntry)
        .then(() => console.log("✅ Log saved to Firestore"))
        .catch(error => console.error("❌ Failed to save log:", error));
}

// Make functions available globally
window.registerUser = registerUser;
window.loginUser = loginUser;
window.logoutUser = logoutUser;
window.checkAuthState = checkAuthState;