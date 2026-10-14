const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

const getAll = async (req, res) => {
    try {
        const result = await mongodb.getDatabase().db().collection("loans").find();
        const items = await result.toArray();
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getSingle = async (req, res) => {
    try {
        const id = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().db().collection("loans").find({ _id: id });
        const items = await result.toArray();
        if (items.length === 0) {
            return res.status(404).json({ error: "Loan not found" });
        }
        res.status(200).json(items[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createLoan = async (req, res) => {
    try {
        const { membershipId, isbn, loanDate, dueDate } = req.body;
        if (!membershipId || !isbn || !loanDate || !dueDate) {
            return res.status(400).json({ error: "All fields are required." });
        }
        const response = await mongodb.getDatabase().db().collection("loans").insertOne({ membershipId, isbn, loanDate, dueDate });
        res.status(201).json({ id: response.insertedId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateLoan = async (req, res) => {
    try {
        const id = new ObjectId(req.params.id);
        const { membershipId, isbn, loanDate, dueDate } = req.body;
        if (!membershipId || !isbn || !loanDate || !dueDate) {
            return res.status(400).json({ error: "All fields are required." });
        }
        const response = await mongodb.getDatabase().db().collection("loans").replaceOne({ _id: id }, { membershipId, isbn, loanDate, dueDate });
        if (response.matchedCount === 0) {
            return res.status(404).json({ error: "Loan not found" });
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteLoan = async (req, res) => {
    try {
        const id = new ObjectId(req.params.id);
        const response = await mongodb.getDatabase().db().collection("loans").deleteOne({ _id: id });
        if (response.deletedCount === 0) {
            return res.status(404).json({ error: "Loan not found" });
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getAll, getSingle, createLoan, updateLoan, deleteLoan };