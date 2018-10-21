const express = require('express');
const app = express();
var sse = require('./sse');

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.route('/api/cats').get((req, res) => {
    res.send({
        cats: [{ name: 'lilly' }, { name: 'lucy' }]
    });
});

app.use(sse);

var connections = {};

app.get('/sse/:userId', function(req,res){
    
    let userId = req.params.userId;
    
    let data;
    
    connections[userId] = req;
    
    res.sseSetup();
    
    let intervalId = setInterval(function(){
        console.log(`*** Interval loop. userId: "${userId}"`);
        
        data = {
            userId,
            time: new Date().getTime(),
        };
        
        res.sseSend(data);   
    }, 2000);
    
    res.write(':\n\n');
    
    req.on("close", function() {
        let userId = req.params.userId;
        console.log(`*** Close. userId: "${userId}"`);
        // Breaks the interval loop on client disconnected
        clearInterval(intervalId);
        // Remove from connections
        delete connections[userId];
    });

    req.on("end", function() {
        let userId = req.params.userId;
        console.log(`*** End. userId: "${userId}"`);
    });
});

module.exports = app;