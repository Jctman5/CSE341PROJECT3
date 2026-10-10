const mongodb = require("../data/database");
const ObjectId = require("mongodb").ObjectId;
//all member controller routes created by Jackson Taylor
const getAll = async (req, res) => {
    const result = await mongodb.getDatabase().db().collection("members").find();
    result.toArray().then((members) => {
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(members);
    });
};

const getSingle = async (req, res) => {
    const memberId = new ObjectId(req.params.id);
    const result = await mongodb.getDatabase().db().collection("members").find({ _id: memberId });
    result.toArray().then((members) => {
        res.setHeader("Content-Type", "application/json");
        res.status(200).json(members[0]);
    });
};
const createMember = async (req, res) => {
    const member = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        membershipid: req.body.membershipid,
        phone: req.body.phone,
        favoriteGenre: req.body.favoriteGenre,
        joinDate: req.body.joinDate,
    };
    const response = await mongodb.getDatabase().db().collection("members").insertOne(member);
    if (response.acknowledged){
        res.status(201).json({ id: response.insertedId });
    } 
    else{
        res.status(500).json(response.error || "Some error occured creating the member.");
    }
};
const updateMember = async (req, res) => {
    const memberId = new ObjectId(req.params.id);
    const member = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        membershipid: req.body.membershipid,
        phone: req.body.phone,
        favoriteGenre: req.body.favoriteGenre,
        joinDate: req.body.joinDate
    };
    const response = await mongodb.getDatabase().db().collection("members").replaceOne({_id: memberId}, member);
    console.log("UPDATE RESULT:", response);
    if (response.matchedCount === 0) {
        return res.status(404).json({ error: "Member not found" });
    }
    res.status(204).send();
};
const deleteMember = async (req, res) => {
    const memberId = new ObjectId(req.params.id);
    const response = await mongodb.getDatabase().db().collection("members").deleteOne({_id: memberId});
    if (response.deletedCount > 0){
        res.status(204).send();
    } 
    else{
        res.status(500).json(response.error || "Some error occured while deleting the member.");
    }
}

module.exports = {
    getAll,
    getSingle,
    createMember,
    updateMember,
    deleteMember
};