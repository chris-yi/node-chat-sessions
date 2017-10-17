const express = require('express');
const bodyParser = require('body-parser');
const mc = require( `${__dirname}/controllers/messages_controller` );
const session = require("express-session");
const createInitialSession = require("./middlewares/session")
const filter = require("./middlewares/filter")

const app = express();

app.use( bodyParser.json() );
app.use( express.static( `${__dirname}/../public/build` ) );
app.use(session({
    secret: "akldjfa;lsdkjfa;dkfja;sdkfja;dkj",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 10000
    }
}))
app.use(createInitialSession)
app.use(() => {
    if(req.method === "POST" || req.method === "PUT") {
        filter(req, res, next);
    }
    next();
})


const messagesBaseUrl = "/api/messages";
app.post( messagesBaseUrl, mc.create );
app.get( messagesBaseUrl, mc.read );
app.put( `${messagesBaseUrl}`, mc.update );
app.delete( `${messagesBaseUrl}`, mc.delete );
app.get("/api/messages/history", mc.history );

const port = 3000;
app.listen( port, () => { console.log(`Server listening on port ${port}.`); } );