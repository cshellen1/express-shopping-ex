process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../app");
let items = require("../fakeDb");

let pickles = {
	name: "pickles",
	price: "2.99",
};

beforeEach(function () {
	items.push(pickles);
});

afterEach(function () {
	items.length = 0;
});

describe("GET /items", () => {
	test("Get all items", async () => {
		const res = await request(app).get("/items");
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({ items: [pickles] });
	});
});

describe("GET /items/:name", () => {
	test("Get item by description name", async () => {
		const res = await request(app).get(`/items/${pickles.name}`);
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({ item: pickles });
	});

	test("Responds with 404 if an invalid name/description is given", async () => {
		const res = await request(app).get("/items/hhuiiuk");
		expect(res.statusCode).toBe(404);
	});
});

describe("POST /items", () => {
    test("Adds new item to items", async () => {
        const res = await request(app).post("/items").send({ name: "popsicle", price: "1.99" });
        expect(res.statusCode).toBe(201);
	});
	
	test("Responds with 400 if description and price are missing", async () => {
        const res = await request(app).post("/items").send({});
        expect(res.statusCode).toBe(400);
    });
});

describe("PATCH /items/:name", () => {
	test("updates an items name and price", async () => {
		const res = await request(app).patch(`/items/${pickles.name}`).send({ name: "oranges", price: "1.00" });
		expect(res.statusCode).toBe(201);
		expect(res.body).toEqual({ updated: { name: "oranges", price: "1.00" } });
	});
});

describe("DELETE /items/:name", () => {
	test("deletes an item", async () => {
		const res = await request(app).delete(`/items/${pickles.name}`);
		expect(items).toEqual([]);
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({ message: "Deleted" });
	});
});
