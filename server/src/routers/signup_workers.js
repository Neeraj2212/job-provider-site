const express = require("express");
const Worker = require("../models/signup_workers");
const router = new express.Router();
const errorHandler = require("../error-handler/Errorhandler").errorhandler;

var RateLimit = require("express-rate-limit");
var limiter = new RateLimit({
	windowMs: 1 * 60 * 1000, // 1 minute
	max: 5,
});

router.use(limiter);

router.post("/workers", async (req, res) => {
	const worker = new Worker(req.body);

	try {
		if (req.body.password !== req.body.confirm_password) {
			return res.status(400).send("Password does not match");
		}
		await worker.save();

		const token = await worker.generateAuthToken();
		//res.json(worker)
		res.status(201).send({ worker, token });
	} catch (e) {
		errorHandler(res, e);
	}
});

module.exports = router;
