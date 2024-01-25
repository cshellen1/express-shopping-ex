const express = require("express");
const app = express();
const items = require("./fakeDb");
const ExpressError = require("./expressError");
const itemRoutes = require("./routes/items");

app.use(express.json());
app.use("/items", itemRoutes);

app.use(function (req, res, next) {
	let e = new ExpressError("Not Found", 404);
	next(e);
});

app.use((err, req, res, next) => {
	let status = err.status || 500;
	let message = err.message;

	return res.status(status).json({
		error: { message, status },
	});
});

module.exports = app;
