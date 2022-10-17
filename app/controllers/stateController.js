const db = require('../models');
const State = db.State;

module.exports = {
    addState: (req,res,next) => {
        try{
            console.log('sdsdf',State)
            let data = req.body;
            State.create(data)
                .then(state => res.status(200).json({ error: false,message:'State created successfully' ,data: state }))
                .catch(err => res.status(500).json({ error: true, message: err.message }));
        } catch(err) {
            res.status(500).json({ error: true, message: err.message })
        }
    },

    getAllStates: (req,res,next) => {
        try {
            let order = [['state_id', 'ASC']];
            let limit = req.query.limit || 10;
            let offset = req.query.offset || 0;
            State.findAll({ order, limit, offset })
                .then(stateList => res.status(200).json({ error: false, data: stateList }))
                .catch(err => res.status(500).json({ error: true, message: err.message }));
        } catch(err) {
            res.status(500).json({ error: true, message: err.message })
        }
    },
}
