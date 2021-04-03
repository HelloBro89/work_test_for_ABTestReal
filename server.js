const express = require('express');
const app = express();
const jsonParser = express.json();
const Sequelize = require("sequelize");
const port = process.env.PORT || 3000;


const sequelize = port == 3000 ? new Sequelize("testWork", "root", "korolik", {
    dialect: "mysql",
    port: 3307,
    host: "localhost",
    define: {
        timestamps: false
    }
}) :
    new Sequelize("r9gtarcy2dxytuyx", "u3q19qaz42l8e4p8", "ymy8duaz53pfomvc", {
        dialect: "mysql",
        port: 3306,
        host: "yvu4xahse0smimsc.chr7pe7iynqr.eu-west-1.rds.amazonaws.com",
        define: {
            timestamps: false
        }
    });

const Users = sequelize.define('dateInfo', {
    userId: {
        type: Sequelize.STRING,
        allowNull: false
    },
    dateRegistration: {
        type: Sequelize.STRING,
        allowNull: false
    },
    dateLastActivity: {
        type: Sequelize.STRING,
        allowNull: false
    },
    sumOfDays: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

app.use(express.static(__dirname + "/public"));

app.get('/getDate', jsonParser, (req, res) => {
    Users.findAll().then((data) => {
        res.json(data);
    });
})

app.post('/addDate', jsonParser, function (req, res) {
    console.log(req.body);
    Users.create(req.body).then(() => {
        res.send('Date added...')
    });
});

app.delete('/clearDB', jsonParser, function (req, res) {
    console.log(req.body)
    Users.destroy({
        where: {}
    }).then(() => {
        res.send("Data deleted...");
    });
})

sequelize.sync().then(() => {
    app.listen(port, function () {
        console.log("The server is waiting for a connection...");
    });
}).catch(err => console.log(err));





