exports.errorhandler = (res, error) => {
	if (error.name == "ValidationError") {
		return this.validation(res, error);
	}
};

exports.validation = (res, error) => {
	let err = Object.keys(error.errors);
	err_msg = [];
	err.forEach((element) => {
		err_msg.push(error.errors[element].message);
	});
	// console.log(err_msg);
	res.json(err_msg);
};
