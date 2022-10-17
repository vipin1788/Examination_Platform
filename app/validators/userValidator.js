const util = require('util');

exports.addUserTypeValidator = function addUserTypeValidator(req, res, next) {
    req.checkBody({
        user_type_name: {
            notEmpty: true,
            errorMessage: 'User Type should not be empty',
        }
    });

    const errors = req.validationErrors();
    if (errors) {
        return res.status(400).json({ error: true, message: util.inspect(errors) });
    }
    return next();
};
