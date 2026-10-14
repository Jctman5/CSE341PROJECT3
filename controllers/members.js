const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;

const getAll = async (req, res) => {
    try {
        const result = await mongodb.getDatabase().db().collection("members").find();
        const items = await result.toArray();
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getSingle = async (req, res) => {
    try {
        const id = new ObjectId(req.params.id);
        const result = await mongodb.getDatabase().db().collection("members").find({ _id: id });
        const items = await result.toArray();
        if (items.length === 0) {
            return res.status(404).json({ error: "Member not found" });
        }
        res.status(200).json(items[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createMember = async (req, res) => {
    try {
        const { firstName, lastName, email, membershipId, phone, favoriteGenre, joinDate } = req.body;
        if (!firstName || !lastName || !email) {
            return res.status(400).json({ error: "First name, last name, and email are required." });
        }
        const response = await mongodb.getDatabase().db().collection("members").insertOne({ firstName, lastName, email, membershipId, phone, favoriteGenre, joinDate });
        res.status(201).json({ id: response.insertedId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateMember = async (req, res) => {
    try {
        const id = new ObjectId(req.params.id);
        const { firstName, lastName, email, membershipId, phone, favoriteGenre, joinDate } = req.body;
        if (!firstName || !lastName || !email) {
            return res.status(400).json({ error: "First name, last name, and email are required." });
        }
        const response = await mongodb.getDatabase().db().collection("members").replaceOne({ _id: id }, { firstName, lastName, email, membershipId, phone, favoriteGenre, joinDate   });
        if (response.matchedCount === 0) {
            return res.status(404).json({ error: "Member not found" });
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteMember = async (req, res) => {
    try {
        const id = new ObjectId(req.params.id);
        const response = await mongodb.getDatabase().db().collection("members").deleteOne({ _id: id });
        if (response.deletedCount === 0) {
            return res.status(404).json({ error: "Member not found" });
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getAll, getSingle, createMember, updateMember, deleteMember };