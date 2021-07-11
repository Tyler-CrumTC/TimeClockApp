// Set up the App Service
const express = require('express');
const app = express();

//Setting up the body parser
const bodyparser = require('body-parser');
app.use(bodyparser.urlencoded({extended: true})); 

// Set up the view engine
app.set('view engine', 'ejs');



// Set up the database
const mongoose = require('mongoose');
const TimeCheck = require('./Models/TimeChecks');
const User = require('./Models/Users');

// Mongo DB connection string
const dbURL = 'mongodb+srv://user1:UUTo7oqGN58dZqE3@timeclock.oaikt.mongodb.net/TimeClock?retryWrites=true&w=majority';

mongoose.connect(dbURL)
    .then((result) => console.log('Connected to db'))
    .catch((err) => console.log(err));

app.get('/CheckIn', (req, res) => {
    const timecheck = new TimeCheck({
        clockType: 'In',
        clockTime: Date.now(),
        clockUser: 2
    });

    timecheck.save()
        .then((result) => {
            res.redirect('/landing');
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        });
})

app.get('/CheckOut', (req, res) => {
    const timecheck = new TimeCheck({
        clockType: 'Out',
        clockTime: Date.now(),
        clockUser: 2
    });

    timecheck.save()
        .then((result) => {
            res.redirect('/landing');
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        });
})

app.get('/allpunches',(req,res) => {
    TimeCheck.find()
        .then((result) => {
            res.redirect('/landing');
        })
        .catch((err) => {
            console.log(err);
            res.send(err);
        })
})


app.get('/', (req,res) =>{
    res.render('index');
})

app.get('/createAccount', (req, res) => {
    res.render('createUser');
})

app.post('/login', (req, res) => {
    var uName = req.body.userName;
    var pw = req.body.password;
    var validUser = false;
    var userID;

    /*const user = new User({
    *    userName: uName,
    *    userPassword: pw,
    *    userType: 1
    });*/

    User.find()
        .then((result) => {
            result.forEach(User => {
                if(uName === User.userName && pw === User.userPassword) {
                    validUser = true;
                    userID = 1;
                } 
            });
        })

        if(validUser) {
            res.redirect('/user/${userID}/landing');
        } else {
            res.send('Invalid Username and/or Password')
        }
    /*user.save()
        .then((result) => {
            res.redirect('/landing');
        });*/
})

app.post('/createAccount',(req,res) => {
    var uName = req.body.userName;
    var pw = req.body.password;
    var userExists = false;
    var maxID = 0;

    User.find()
        .then((result) => {
            if(result.length > 0) {
                result.forEach(User => {
                    if(uName === User.uName) {
                        userExists = true;
                    }
                    if(User.userID > maxID) {
                        maxID = User.userID;
                    }
                })
            }
        })

        if(userExists) {
            res.send('This Username is already in use');
        } else {
            const user = new User({
                userName: uName,
                userPassword: pw,
                userType: 1,
                userID: maxID + 1
            })

            user.save()
                .then((result) => {
                    res.redirect(`/user/${User.userID}/landing`);
                })
        }

})

app.get('/user/:id/landing',(req, res) => {
    TimeCheck.find()
        .then((result) => {
            res.render('landing', {timeClocks: result});
        })
})

app.listen(3000);