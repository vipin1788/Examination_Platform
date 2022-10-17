const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const models = require('./app/models')
const expressValidator = require('express-validator');
// const db = require('./queries')
// const port = 3000
const stateRoutes = require('./app/routes/appRouters/stateRouter')
const cityRoutes = require('./app/routes/appRouters/cityRouter')
const userRoutes = require('./app/routes/appRouters/userRouter')

app.use(bodyParser.json())
app.use(expressValidator())
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "*");
    res.header('Access-Control-Allow-Origin', "*")
    next();
});

app.use('/api/state',stateRoutes)
app.use('/api/city',cityRoutes)
app.use('/api/user',userRoutes);

var port = process.env.PORT || 8080;


models.sequelize.sync({ force: false }).then(() => {
    console.log('connected to database')
}).catch(err => {
      console.error('Unable to connect to the database:', err);
    });



app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
