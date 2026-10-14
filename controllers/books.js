const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

const getAll = async (req, res) => {
    try {
        const result = await mongodb.getDatabase().db().collection("books").find();
        const items = await result.toArray();
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getSingle = async (req, res) => {
    try {
        const id = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().db().collection("books").find({ _id: id });
        const items = await result.toArray();
        if (items.length === 0) {
            return res.status(404).json({ error: "Book not found" });
        }
        res.status(200).json(items[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createBook = async (req, res) => {
    try {
        const { title, author, genre, isbn, publicationYear } = req.body;
        if (!title || !author) {
            return res.status(400).json({ error: "title and author are required." });
        }
        const response = await mongodb.getDatabase().db().collection("books").insertOne({ title, author, genre, isbn, publicationYear });
        res.status(201).json({ id: response.insertedId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateBook = async (req, res) => {
    try {
        const id = new ObjectId(req.params.id);
        const { title, author, genre, isbn, publicationYear } = req.body;
        if (!title || !author) {
            return res.status(400).json({ error: "title and author are required." });
        }
        const response = await mongodb.getDatabase().db().collection("books").replaceOne({ _id: id }, { title, author, genre, isbn, publicationYear });
        if (response.matchedCount === 0) {
            return res.status(404).json({ error: "Book not found" });
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteBook = async (req, res) => {
    try {
        const id = new ObjectId(req.params.id);
        const response = await mongodb.getDatabase().db().collection("books").deleteOne({ _id: id });
        if (response.deletedCount === 0) {
            return res.status(404).json({ error: "Book not found" });
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getAll, getSingle, createBook, updateBook, deleteBook };