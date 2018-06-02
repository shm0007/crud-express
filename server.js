const express = require('express');
const app = express();
const bodyparser = require('body-parser');
app.use(bodyparser.json());
app.use(bodyparser.raw({extended: true}));

var db;
const mongoClient = require('mongodb').MongoClient;
var objectID = require('mongodb').ObjectID;
const collectionName = 'mobileTest'
mongoClient.connect('mongodb://ehsan:qwerty@ds119080.mlab.com:19080/ehsandb',(err, client)=>{
	if(err) return console.log(err);
	db = client.db('ehsandb');
	app.listen(3000,'0.0.0.0');
console.log("example app running");	
})
app.get('/', (req,res) =>{
    db.collection(collectionName).find().toArray((err, result)=>{
        res.send(result);
    })
})
app.get('/:id', (req, res) =>{
    if(objectID.isValid(req.params.id)== false)
        return res.status(400).send("Bad Request");
    db.collection(collectionName).find({
        _id: objectID(req.params.id)
    }).toArray((err, result)=>{
            if(result[0]!=null)
                res.send(result);
            else
                res.status(400).send("Bad Request");    

    })
})
app.post('/', (req,res) =>{

    db.collection(collectionName).find({
        name: req.body.name,
        price : req.body.price,
        number : req.body.number
    }).toArray((err,result) =>{
        if (result[0]!=null)
            return res.status(409).send("409 Duplicate ");
        else{
            db.collection(collectionName).save(req.body, (err, result)=>{
                if(err) return console.log(err);
                console.log("saved to database");
                res.status(201).send(req.body); 
            })
        }

    })
})
app.put('/:id', function(req, res) {
    db.collection(collectionName)
        .findOneAndUpdate({
            "_id": objectID(req.params.id)
        }, {
            $set: {
                "name": req.body.name,
                "price": req.body.price,
                "mobile": req.body.mobile
            }
    });
        /*
    db.collection(collectionName)
        .findOneAndUpdate({
            "_id": objectID(req.params.id)
        }, {
            $unset: {
                "name": 0,
                "price": req.body.price,
                "mobile": req.body.mobile
            }
    });
    
    */
        
    res.send(req.body);
})

app.patch('/users/:id', function(req, res) {
    db.collection(collectionName)
        .update({
            "_id": objectID(req.params.id)
        }, {
            $set: req.body
        });
    res.redirect(303,req.baseUrl+ "/");
})

app.delete('/:id', function(req, res) {
    db.collection(collectionName).remove({
        "_id": ObjectID(req.params.id)
    });
    res.redirect('/');
})

app.delete('/', function(req, res) {
    db.collection(collectionName).remove({});
    res.redirect('/');
})
app.all('*',function(req,res){
    res.status(404).send("ERROR 400 Not Found!!!");
})
