const request = require("supertest");
const app = require("../app");
const mongodb = require("../data/database");

jest.mock("../data/database");

const fakeBooks = [
    { _id: "6ab803c501daad728b7d7c5b", title: "Book 1", author: "Author 1" },
    { _id: "6ab803c501daad728b7d7c5c", title: "Book 2", author: "Author 2" }
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

describe("GET /books", () => {
    test("returns all books", async () => {
        mockFind(fakeBooks);
        const res = await request(app).get("/books");
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveLength(2);
    });

    test("returns 500 when the database throws", async () => {
        mongodb.getDatabase.mockImplementation(() => { throw new Error("db down"); });
        const res = await request(app).get("/books");
        expect(res.statusCode).toBe(500);
    });
});

describe("GET /books/:id", () => {
    test("returns one book", async () => {
        mockFind([fakeBooks[0]]);
        const res = await request(app).get("/books/6ab803c501daad728b7d7c5b");
        expect(res.statusCode).toBe(200);
        expect(res.body.title).toBe("Book 1");
    });

    test("returns 404 when not found", async () => {
        mockFind([]);
        const res = await request(app).get("/books/6ab803c501daad728b7d7c5b");
        expect(res.statusCode).toBe(404);
    });

    test("returns 500 for an invalid id", async () => {
        mockFind([]);
        const res = await request(app).get("/books/not-a-real-id");
        expect(res.statusCode).toBe(500);
    });
});