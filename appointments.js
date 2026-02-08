// ============================================
// APPOINTMENTS HANDLER
// ============================================

// Book a new appointment
async function bookAppointment(teacherId, appointmentData) {
    try {
        console.log("📅 Booking appointment with teacher:", teacherId);
        
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            throw new Error("User not logged in");
        }
        
        // Create appointment object
        const appointment = {
            studentId: user.uid,
            studentName: user.name || user.email,
            teacherId: teacherId,
            date: appointmentData.date,
            time: appointmentData.time,
            purpose: appointmentData.purpose,
            status: "pending", // pending, approved, cancelled, completed
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            messages: [] // Will store chat messages
        };
        
        // Save to Firestore
        const docRef = await db.collection("appointments").add(appointment);
        
        console.log("✅ Appointment booked with ID:", docRef.id);
        
        // Log the action
        logAction("APPOINTMENT_BOOKED", user.uid, {
            appointmentId: docRef.id,
            teacherId: teacherId,
            date: appointmentData.date,
            time: appointmentData.time
        });
        
        return { 
            success: true, 
            message: "Appointment booked successfully!",
            appointmentId: docRef.id 
        };
        
    } catch (error) {
        console.error("❌ Error booking appointment:", error);
        
        logAction("APPOINTMENT_BOOKING_FAILED", null, {
            error: error.message,
            teacherId: teacherId
        });
        
        return { 
            success: false, 
            message: "Failed to book appointment: " + error.message 
        };
    }
}

// Get all appointments for current user
async function getMyAppointments() {
    try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            return { success: false, appointments: [] };
        }
        
        let query;
        
        if (user.type === "student") {
            query = db.collection("appointments")
            .where("studentId", "==", user.uid);
        } else if (user.type === "teacher") {
            // Teacher sees appointments booked with them
            query = db.collection("appointments")
                .where("teacherId", "==", user.uid)
                .orderBy("date", "desc")
                .orderBy("time", "desc");
        } else if (user.type === "admin") {
            // Admin sees all appointments
            query = db.collection("appointments")
                .orderBy("date", "desc")
                .orderBy("time", "desc");
        }
        
        const snapshot = await query.get();
        const appointments = [];
        
        snapshot.forEach((doc) => {
            appointments.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        console.log(`✅ Found ${appointments.length} appointments`);
        
        return { success: true, appointments: appointments };
        
    } catch (error) {
        console.error("❌ Error getting appointments:", error);
        return { success: false, appointments: [], error: error.message };
    }
}

// Update appointment status (approve/cancel)
async function updateAppointmentStatus(appointmentId, newStatus) {
    try {
        console.log(`🔄 Updating appointment ${appointmentId} to ${newStatus}`);
        
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            throw new Error("User not logged in");
        }
        
        await db.collection("appointments").doc(appointmentId).update({
            status: newStatus,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedBy: user.uid
        });
        
        // Log the action
        logAction("APPOINTMENT_STATUS_CHANGED", user.uid, {
            appointmentId: appointmentId,
            newStatus: newStatus
        });
        
        return { success: true, message: `Appointment ${newStatus} successfully!` };
        
    } catch (error) {
        console.error("❌ Error updating appointment:", error);
        
        logAction("APPOINTMENT_UPDATE_FAILED", null, {
            appointmentId: appointmentId,
            error: error.message
        });
        
        return { success: false, message: "Failed to update appointment: " + error.message };
    }
}

// Send a message in appointment chat
async function sendAppointmentMessage(appointmentId, messageText) {
    try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            throw new Error("User not logged in");
        }
        
        const message = {
            text: messageText,
            senderId: user.uid,
            senderName: user.name || user.email,
            senderType: user.type,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        // Add message to appointment's messages array
        await db.collection("appointments").doc(appointmentId).update({
            messages: firebase.firestore.FieldValue.arrayUnion(message)
        });
        
        console.log("💬 Message sent to appointment:", appointmentId);
        
        logAction("MESSAGE_SENT", user.uid, {
            appointmentId: appointmentId,
            messageLength: messageText.length
        });
        
        return { success: true, message: "Message sent!" };
        
    } catch (error) {
        console.error("❌ Error sending message:", error);
        return { success: false, message: "Failed to send message: " + error.message };
    }
}

// Get all teachers (for student to choose from)
async function getAllTeachers() {
    try {
        console.log("👨‍🏫 Fetching all teachers");
        
        const snapshot = await db.collection("users")
            .where("type", "==", "teacher")
            .get();
        
        const teachers = [];
        snapshot.forEach((doc) => {
            teachers.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        console.log(`✅ Found ${teachers.length} teachers`);
        
        return { success: true, teachers: teachers };
        
    } catch (error) {
        console.error("❌ Error getting teachers:", error);
        return { success: false, teachers: [], error: error.message };
    }
}

// Make functions available globally
window.bookAppointment = bookAppointment;
window.getMyAppointments = getMyAppointments;
window.updateAppointmentStatus = updateAppointmentStatus;
window.sendAppointmentMessage = sendAppointmentMessage;
window.getAllTeachers = getAllTeachers;