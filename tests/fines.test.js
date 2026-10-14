const request = require("supertest");
const app = require("../app");
const mongodb = require("../data/database");

jest.mock("../data/database");

const fakeFines = [
    { _id: "6ab803c501daad728b7d7c5b", amount: 10.00, status: "unpaid" },
    { _id: "6ab803c501daad728b7d7c5c", amount: 20.00, status: "unpaid" }
];

// Makes getDatabase().db().collection().find().toArray() return whatever we pass in
const mockFind = (results) => {
    mongodb.getDatabase.mockReturnValue({
        db: () => ({
            collection: () => ({
                find: () => ({ toArray: async () => results })
            })
        })
    });
};

describe("GET /fines", () => {
    test("returns all fines", async () => {
        mockFind(fakeFines);
        const res = await request(app).get("/fines");
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(2);
    });

    test("returns 500 when the database throws", async () => {
        mongodb.getDatabase.mockImplementation(() => { throw new Error("db down"); });
        const res = await request(app).get("/fines");
        expect(res.statusCode).toBe(500);
    });
});

describe("GET /fines/:id", () => {
    test("returns one fine", async () => {
        mockFind([fakeFines[0]]);
        const res = await request(app).get("/fines/6ab803c501daad728b7d7c5b");
        expect(res.statusCode).toBe(200);
        expect(res.body.amount).toBe(10.00);
    });

    test("returns 404 when not found", async () => {
        mockFind([]);
        const res = await request(app).get("/fines/6ab803c501daad728b7d7c5b");
        expect(res.statusCode).toBe(404);
    });

    test("returns 500 for an invalid id", async () => {
        mockFind([]);
        const res = await request(app).get("/fines/not-a-real-id");
        expect(res.statusCode).toBe(500);
    });
});