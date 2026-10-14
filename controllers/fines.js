const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

const getAll = async (req, res) => {
    try {
        const result = await mongodb.getDatabase().db().collection("fines").find();
        const items = await result.toArray();
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getSingle = async (req, res) => {
    try {
        const id = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().db().collection("fines").find({ _id: id });
        const items = await result.toArray();
        if (items.length === 0) {
            return res.status(404).json({ error: "Fine not found" });
        }
        res.status(200).json(items[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createFine = async (req, res) => {
    try {
        const { fineId, amount, membershipId, paymentStatus, issuedDate } = req.body;
        if (!fineId || !amount || !membershipId || !paymentStatus || !issuedDate) {
            return res.status(400).json({ error: "All fields are required." });
        }
        const response = await mongodb.getDatabase().db().collection("fines").insertOne({ fineId, amount, membershipId, paymentStatus, issuedDate });
        res.status(201).json({ id: response.insertedId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateFine = async (req, res) => {
    try {
        const id = new ObjectId(req.params.id);
        const { fineId, amount, membershipId, paymentStatus, issuedDate } = req.body;
        if (!fineId || !amount || !membershipId || !paymentStatus || !issuedDate) {
            return res.status(400).json({ error: "All fields are required." });
        }
        const response = await mongodb.getDatabase().db().collection("fines").replaceOne({ _id: id }, { fineId, amount, membershipId, paymentStatus, issuedDate });
        if (response.matchedCount === 0) {
            return res.status(404).json({ error: "Fine not found" });
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteFine = async (req, res) => {
    try {
        const id = new ObjectId(req.params.id);
        const response = await mongodb.getDatabase().db().collection("fines").deleteOne({ _id: id });
        if (response.deletedCount === 0) {
            return res.status(404).json({ error: "Fine not found" });
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getAll, getSingle, createFine, updateFine, deleteFine };