const express = require("express");
const router = new express.Router();
const ExpressError = require("../expressError");
const items = require("../fakeDb");

router.get("/", (req, res) => {
	return res.json({ items });
});

router.post("/", (req, res, next) => {
    try {

        if (!req.body.name || !req.body.price) throw new ExpressError("Must enter item name and price", 400);
        const newItem = { name: req.body.name, price: req.body.price }
        items.push(newItem);
        return res.status(201).json({ "added": newItem });

    } catch (err) {
        return next(err);
    }
})

router.get("/:name", (req, res, next) => {
    try {

        const foundItem = items.find(item => item.name == req.params.name);
        if (!foundItem) throw new ExpressError("Item not found", 404);
        return res.status(200).json({ item: foundItem });

    } catch (err) {
        return next(err);
    }
})

router.patch("/:name", (req, res, next) => {
    try {

        const foundItem = items.find(item => item.name == req.params.name);
        if (!foundItem) throw new ExpressError("Item not found", 404);
        if (req.body.name) foundItem.name = req.body.name;
        if (req.body.price) foundItem.price = req.body.price;

        return res.status(201).json({ updated: foundItem });

    } catch (err) {
        return next(err);
    }
})

router.delete("/:name", (req, res, next) => {
    try {

        const foundItem = items.find(item => item.name == req.params.name);
        if (!foundItem) throw new ExpressError("Item not found", 404);
        items.splice(items.indexOf(foundItem));
        return res.status(200).json({ message: "Deleted" });

    } catch (err) {
        return next(err);
    }
})

module.exports = router;