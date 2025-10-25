const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Register a new user
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if username already exists
    const userExists = users.some(user => user.username === username);
    if (userExists) {
        return res.status(409).json({ message: "Username already exists" });
    }

    // Add new user
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
});


// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    try {
        // Simulate async operation with a Promise
        const getBooksAsync = () => {
            return new Promise((resolve, reject) => {
                if (books) {
                    resolve(books); // Resolve with books data
                } else {
                    reject("No books available");
                }
            });
        };

        const allBooks = await getBooksAsync(); // Await the promise
        res.status(200).json(allBooks); // Send response as JSON
    } catch (error) {
        res.status(500).json({ message: error });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const isbn = req.params.isbn;

        // Simulate async operation with a Promise
        const getBookByISBN = (isbn) => {
            return new Promise((resolve, reject) => {
                if (books[isbn]) {
                    resolve(books[isbn]);
                } else {
                    reject("Book not found");
                }
            });
        };

        const book = await getBookByISBN(isbn); // Await the Promise
        res.status(200).json(book); // Return book details
    } catch (error) {
        res.status(404).json({ message: error });
    }
});
  
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    try {
        const author = req.params.author;

        // Simulate async operation with a Promise
        const getBooksByAuthor = (author) => {
            return new Promise((resolve, reject) => {
                const bookKeys = Object.keys(books);
                const booksByAuthor = [];

                bookKeys.forEach((key) => {
                    if (books[key].author === author) {
                        booksByAuthor.push(books[key]);
                    }
                });

                if (booksByAuthor.length > 0) {
                    resolve(booksByAuthor);
                } else {
                    reject("No books found for the given author");
                }
            });
        };

        const result = await getBooksByAuthor(author); // Await the Promise
        res.status(200).json(result); // Send the books as JSON
    } catch (error) {
        res.status(404).json({ message: error });
    }
});
// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    try {
        const title = req.params.title;

        // Simulate async operation with a Promise
        const getBooksByTitle = (title) => {
            return new Promise((resolve, reject) => {
                const bookKeys = Object.keys(books);
                const booksByTitle = [];

                bookKeys.forEach((key) => {
                    if (books[key].title === title) {
                        booksByTitle.push(books[key]);
                    }
                });

                if (booksByTitle.length > 0) {
                    resolve(booksByTitle);
                } else {
                    reject("No books found with the given title");
                }
            });
        };

        const result = await getBooksByTitle(title); // Await the Promise
        res.status(200).json(result); // Send books as JSON
    } catch (error) {
        res.status(404).json({ message: error });
    }
});
  

//  Get book review
// Get book review
// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn; // Retrieve ISBN from URL parameter
    const book = books[isbn]; // Find book by ISBN

    if (book) {
        // Send only the reviews of the book
        res.status(200).json({ reviews: book.reviews });
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});


module.exports.general = public_users;
