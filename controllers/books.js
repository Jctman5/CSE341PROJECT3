const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;
//all book controller routes created by Jackson Taylor
const getAll = async (req, res) => {
    const result = await mongodb.getDatabase().db().collection("books").find();
    try {
        result.toArray().then((books) => {
            res.setHeader("Content-Type", "application/json");
            res.status(200).json(books);
        });
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching books." });
    }
};

const getSingle = async (req, res) => {
    const bookId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().db().collection("books").find({ _id: bookId });
    try {
        result.toArray().then((books) => {
            res.setHeader("Content-Type", "application/json");
            res.status(200).json(books[0]);
        });
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching the book." });
    }
};
const createBook = async (req, res) => {
    try {
    const book = {
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        isbn: req.body.isbn,
        publicationYear: req.body.publicationYear
    };
    const response = await mongodb.getDatabase().db().collection("books").insertOne(book);
    if (response.acknowledged){
        res.status(201).json({ id: response.insertedId });
    } 
    else{
        res.status(500).json(response.error || "Some error occured creating the book.");
    }
} catch (error) {
    res.status(500).json({ error: "An error occurred while creating the book." });
}}
const updateBook = async (req, res) => {
    try {
    const bookId = new ObjectId(req.params.id);
    const book = {
        title: req.body.title,
        author: req.body.author,
        genre: req.body.genre,
        isbn: req.body.isbn,
        publicationYear: req.body.publicationYear
    };
    const response = await mongodb.getDatabase().db().collection("books").replaceOne({_id: bookId}, book);
    console.log("UPDATE RESULT:", response);
    if (response.matchedCount === 0) {
        return res.status(404).json({ error: "Book not found" });
    }
    res.status(204).send();
} catch (error) {
    res.status(500).json({ error: "An error occurred while updating the book." });
}}
const deleteBook = async (req, res) => {
    try {
        const bookId = new ObjectId(req.params.id);
        const response = await mongodb.getDatabase().db().collection("books").deleteOne({_id: bookId});
        if (response.deletedCount > 0){
            res.status(204).send();
        } 
        else{
            res.status(500).json(response.error || "Some error occured while deleting the book.");
        }
    } catch (error) {
        res.status(500).json({ error: "An error occurred while deleting the book." });
    }
};

module.exports = {
    getAll,
    getSingle,
    createBook,
    updateBook,
    deleteBook
};