const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;

//feedback Schema

const FeedbackSchema = new Schema({
	rating: {
		type: Number,
		required: true,
		min: 0,
		max: 5,
	},
	review: String,
});

//Schema for Employers
const CustomerSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},

		contact: {
			type: String,
			unique: true,
			//	required: true,
		},
		email: {
			type: String,
			unique: true,
			trim: true,
			lowercase: true,
			validate(value) {
				if (!validator.isEmail(value)) {
					throw new Error("Email is invalid");
				}
			},
		},

		address: String,
		password: {
			type: String,
			required: true,
			minlength: [7, "Password should contain atleast 7 characters"],
			trim: true,
		},
		feedback: FeedbackSchema,
		tokens: [
			{
				token: {
					type: String,
					required: true,
					trim: true,
				},
			},
		],
		avatar: {
			type: Buffer,
		},
	},
	{ timestamps: true }
);

CustomerSchema.methods.generateAuthToken = async function () {
	const worker = this;
	const token = jwt.sign(
		{ _id: worker._id.toString() },
		process.env.JWT_SECRET
	);

	worker.tokens = worker.tokens.concat({ token });
	await worker.save();

	return token;
};

// Hash the plain text password before saving
CustomerSchema.pre("save", async function (next) {
	const worker = this;

	if (worker.isModified("password")) {
		worker.password = await bcrypt.hash(worker.password, 8);
	}

	next();
});

const Customer = mongoose.model("customer", CustomerSchema);

module.exports = Customer;
