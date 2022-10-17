const util = require('util');

exports.addStateValidator = function addStateValidator(req, res, next) {
    req.checkBody({
        state_name: {
            notEmpty: true,
            errorMessage: 'State name should not be empty',
        },
    });

    const errors = req.validationErrors();
    if (errors) {
        return res.status(400).json({ error: true, message: util.inspect(errors) });
    }
    return next();
};
