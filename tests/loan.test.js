const request = require("supertest");
const app = require("../app");
const mongodb = require("../data/database");

jest.mock("../data/database");

const fakeLoan = [
    { _id: "6ab803c501daad728b7d7c5b", firstName: "Ann", lastName: "Lee" },
    { _id: "6ab803c501daad728b7d7c5c", firstName: "Bob", lastName: "Kim" }
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

describe("GET /loans", () => {
    test("returns all loans", async () => {
        mockFind(fakeLoan);
        const res = await request(app).get("/loans");
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(2);
    });

    test("returns 500 when the database throws", async () => {
        mongodb.getDatabase.mockImplementation(() => { throw new Error("db down"); });
        const res = await request(app).get("/loans");
        expect(res.statusCode).toBe(500);
    });
});

describe("GET /loans/:id", () => {
    test("returns one loan", async () => {
        mockFind([fakeLoan[0]]);
        const res = await request(app).get("/loans/6ab803c501daad728b7d7c5b");
        expect(res.statusCode).toBe(200);
        expect(res.body.firstName).toBe("Ann");
    });

    test("returns 404 when not found", async () => {
        mockFind([]);
        const res = await request(app).get("/loans/6ab803c501daad728b7d7c5b");
        expect(res.statusCode).toBe(404);
    });

    test("returns 500 for an invalid id", async () => {
        mockFind([]);
        const res = await request(app).get("/loans/not-a-real-id");
        expect(res.statusCode).toBe(500);
    });
});