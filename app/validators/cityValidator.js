const util = require('util');

exports.addCityValidator = function addCityValidator(req, res, next) {
    req.checkBody({
        city_name: {
            notEmpty: true,
            errorMessage: 'City name should not be empty',
        },
        state_id: {
            notEmpty: true,
            errorMessage: 'State id can not be empty',
            isNumeric: {
                errorMessage: 'State id must be numeric'
            }
        }
    });

    const errors = req.validationErrors();
    if (errors) {
        return res.status(400).json({ error: true, message: util.inspect(errors) });
    }
    return next();
};
