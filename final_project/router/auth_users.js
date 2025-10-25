const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (authenticatedUser(username, password)) {
        const token = jwt.sign({ username }, "access", { expiresIn: "1h" });

        // Save JWT in session
        req.session.authorization = {
            accessToken: token
        };

        return res.status(200).json({ message: "User logged in successfully", token });
    } else {
        return res.status(401).json({ message: "Invalid username or password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;

    if (!review) {
        return res.status(400).json({ message: "Review text is required as a query parameter" });
    }

    // Get the logged-in username from session
    const username = req.session.authorization?.username || req.user?.username;

    if (!username) {
        return res.status(403).json({ message: "User not authenticated" });
    }

    // Check if the book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Initialize reviews object if not present
    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    // Add or modify review for the username
    books[isbn].reviews[username] = review;

    return res.status(200).json({
        message: `Review for ISBN ${isbn} added/modified successfully`,
        reviews: books[isbn].reviews
    });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;

    // Get logged-in username from session
    const username = req.session.authorization?.username || req.user?.username;

    if (!username) {
        return res.status(403).json({ message: "User not authenticated" });
    }

    // Check if book exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Check if user has a review to delete
    if (books[isbn].reviews && books[isbn].reviews[username]) {
        delete books[isbn].reviews[username];
        return res.status(200).json({
            message: `Review by ${username} for book ID ${isbn} deleted successfully`,
            reviews: books[isbn].reviews
        });
    } else {
        return res.status(404).json({ message: "No review found for this user to delete" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
