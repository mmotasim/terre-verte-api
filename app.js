var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
var userfile = "users.csv"

var fs = require('fs'),
readline = require('readline');
var locdata_dir = "./locdata/"
var schedule = require('node-schedule')



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

app.get('/users',function(req,res){
    users = []
    userfile = "users.csv"
    var rd = readline.createInterface({
        
                input: fs.createReadStream(userfile),
                output: process.stdout,
                console: false
                });
                rd.on('line', function(line) {
                    
                    words = line.split(",");
                    if(words.length > 1){
                        username = words[0]
                        users.push(username)
                    }
                })
                .on('close',function(){
                        res.send({'users':users});
                        res.end();
                    
        
                });

})

app.post('/locdata',function(req,res){

    var userlocfile = locdata_dir+req.body.username+".csv"
    var data = req.body.username+','+req.body.long+','+req.body.lat+','+req.body.start_time+','+req.body.end_time+','+req.body.mode
    var response = {dataWritten:true}
    fs.appendFile(userlocfile, data ,function(){
        res.send(response)
        res.end()    
    });
})

app.post('/annotatedlocdata', function(req,res){
    data = req.body.data
    annotated_dir = "./annotated_locdata/"
    fpath = annotated_dir+req.body.username+".csv"
    full_data = ""
    for(var i=0;i<data.length;i++){
        full_data += data[i]+"\n"
    }
    fs.writeFile(fpath, full_data, function(err) {
            if(err) {
                return console.log(err);
            }
            res.send({dataWritten:true})
        });
        
})

app.post('/login',function(req,res){
    var rd = readline.createInterface({
        
                input: fs.createReadStream(userfile),
                output: process.stdout,
                console: false
                });
                response = {userAuthenticated:false}
                rd.on('line', function(line) {
                    
                    words = line.split(",");
                    if(words.length > 1){
                        username = words[0]
                        if(username == req.body.username){
                            if(words[1]== req.body.password){
                                response.userAuthenticated = true
                                res.send(response)
                                res.end()
                            }
                            

                        }
                    }
                })
                .on('close',function(){
                    if(!response.userAuthenticated){
                        res.send(response);
                        res.end();
                    }
        
                });
})
app.post('/getlocdata',function(req,res){
    var userlocfile = locdata_dir+req.body.username+".csv";
    var rd = readline.createInterface({
        
                input: fs.createReadStream(userlocfile),
                output: process.stdout,
                console: false
                });
                data = []
                rd.on('line', function(line) {
                    data.push(line)
                })
                .on('close',function(){
                    res.send({'data':data})
                    
                });
});

app.post("/getranking",function(req,res){

        var rankingFile = "greenscores.csv"
        var rd = readline.createInterface({
        
                input: fs.createReadStream(rankingFile),
                output: process.stdout,
                console: false
                });
                data = []
                rd.on('line', function(line) {
                    words = line.split(",")
                    if(words.length>1){
                        datum = {}
                        datum['name'] = words[0]
                        datum['score'] = words[1]
                        data.push(datum)
                    }
                    
                })
                .on('close',function(){
                    res.send({'ranking':data,'user':{'rank':56,'score':22}})
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