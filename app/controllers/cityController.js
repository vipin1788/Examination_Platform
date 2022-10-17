const db = require('../models');
const City = db.City;

module.exports = {
    addCity: (req,res,next) => {
        try{
            let data = req.body;
            City.create(data)
                .then(state => res.status(200).json({ error: false,message:'City created successfully' ,data: state }))
                .catch(err => res.status(500).json({ error: true, message: err.message }));
        } catch(err) {
            res.status(500).json({ error: true, message: err.message })
        }
    },

    getAllCity: (req,res,next) => {
        try {
            let order = [['city_id', 'ASC']];
            let limit = req.query.limit || 10;
            let offset = req.query.offset || 0;
            City.findAll({ order, limit, offset })
                .then(cityList => res.status(200).json({ error: false, data: cityList }))
                .catch(err => res.status(500).json({ error: true, message: err.message }));
        } catch(err) {
            res.status(500).json({ error: true, message: err.message })
        }
    },
    getCitiesByState: (req,res,next) => {
        try {
            let order = [['city_id', 'ASC']];
            let limit = req.query.limit || 10;
            let offset = req.query.offset || 0;
            let stateId = req.params.state_id;
            City.findAll({ where: {state_id: stateId},order, limit, offset})
                .then(cityList => res.status(200).json({ error: false, data: cityList }))
                .catch(err => res.status(500).json({ error: true, message: err.message }));
        } catch(err) {
            res.status(500).json({ error: true, message: err.message })
        }
    }
}
