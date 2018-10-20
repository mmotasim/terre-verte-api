var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
var userfile = "users.csv"

var fs = require('fs'),
readline = require('readline');
var locdata_dir = "./locdata/"


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/signup',function(req,res){
    res.send("In get signup"+req.body.username)
})


function signupUser(req,res,err){ 


    var rd = readline.createInterface({

        input: fs.createReadStream(userfile),
        output: process.stdout,
        console: false
        });
        response = {userCreated:true}
        rd.on('line', function(line) {
            
            words = line.split(",");
            if(words.length > 1){
                username = words[0]
                if(username == req.body.username){
                    response.userCreated = false
                    res.send(response)
                    res.end()
                }
            }
        })
        .on('close',function(){
            if(response.userCreated){
                fs.appendFile(userfile, req.body.username+","+req.body.password+"\n",function(){
                    res.send(response)
                    res.end()    
                });
            }

        });



    // username = req.body.username
    // response = {userCreated:false}
    // if(Object.keys(app.locals.users).includes(username)){
    //     res.send(response)
    //     res.end()
    // }
    // else{
    //     response.userCreated = true
    //     app.locals.users[username] = req.body.password
    //     console.log(app.locals.users)
    //     res.send(response)
    //     res.end()
    // }
}

app.post('/signup', function(req,res){
    signupUser(req,res);
    
});

app.post('/locdata',function(req,res){

    var userlocfile = locdata_dir+req.body.username+".csv"
    var data = req.body.time+","+req.body.lat+","+req.body.long+","+req.body.speed+"\n"
    var response = {dataWritten:true}
    fs.appendFile(userlocfile, data ,function(){
        res.send(response)
        res.end()    
    });
})

app.get('/', function (req, res) {
  res.send('Hello World!');
  
});
app.listen(8081, function () {
  console.log('Example app listening on port 3000!');
});

module.exports = app;