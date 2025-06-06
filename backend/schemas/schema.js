module.exports = {
    events: {
        type: "object",
        properties: {
            eventId: { type: "string" },
            title: { type: "string" },
            date: { type: "string", format: "date" }, // Format attendu : YYYY-MM-DD
            location: { type: "string" },
            capacity: { type: "integer" },
            type: { type: "string" }
        },
        required: ["eventId", "title", "date", "location", "capacity", "type"]
    },
    attendees: {
        type: "object",
        properties: {
            attendeeId: { type: "string" },
            name: { type: "string" },
            email: { type: "string", format: "email" },
            phone: { type: "string" }
        },
        required: ["attendeeId", "name", "email", "phone"]
    },
    registrations: {
        type: "object",
        properties: {
            eventId: { type: "string" },
            attendeeId: { type: "string" },
            registrationDate: { type: "string", format: "date" } // Format attendu : YYYY-MM-DD
        },
        required: ["eventId", "attendeeId", "registrationDate"]
    },
    classes: {
        type: "object",
        properties: {
            classId: { type: "string" },
            name: { type: "string" },
            date: { type: "string", format: "date" }, // Format attendu : YYYY-MM-DD
            time: { type: "string" }, // Format attendu : HH:MM
            capacity: { type: "integer" },
            instructor: { type: "string" }
        },
        required: ["classId", "name", "date", "time", "capacity", "instructor"]
    },
    members: {
        type: "object",
        properties: {
            memberId: { type: "string" },
            name: { type: "string" },
            email: { type: "string", format: "email" },
            membershipType: { type: "string" }
        },
        required: ["memberId", "name", "email", "membershipType"]
    },
    bookings: {
        type: "object",
        properties: {
            classId: { type: "string" },
            memberId: { type: "string" },
            bookingDate: { type: "string", format: "date" } // Format attendu : YYYY-MM-DD
        },
        required: ["classId", "memberId", "bookingDate"]
    },
    books: {
        type: "object",
        properties: {
            title: { type: "string" },
            author: { type: "string" },
            isbn: { type: "string" },
            available: { type: "boolean" },
            category: { type: "string" }
        },
        required: ["title", "author", "isbn", "available", "category"]
    },
    students: {
        type: "object",
        properties: {
            studentId: { type: "string" },
            name: { type: "string" },
            department: { type: "string" },
            yearOfStudy: { type: "integer" }
        },
        required: ["studentId", "name", "department", "yearOfStudy"]
    },
    loans: {
        type: "object",
        properties: {
            bookId: { type: "string" },
            studentId: { type: "string" },
            loanDate: { type: "string", format: "date" }, // Format attendu : YYYY-MM-DD
            returnDate: { type: "string", format: "date" } // Format attendu : YYYY-MM-DD ou null
        },
        required: ["bookId", "studentId", "loanDate"]
    }
};