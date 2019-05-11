const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const { MongoClient, ObjectID } = require('mongodb');


const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

//const authRouter = require('./routes/authRoutes');

//app.use('/auth', authRouter);

const url = 'mongodb://localhost:27017';
const dbName = 'MyFirstApp';

app.get('/api', (req,res)=>{
  res.json({
    mesage:'Welcome to API'
  });
});

app.post('/api/posts',  verifyToken, (req,res)=>{
  jwt.verify(req.token, 'mySecretKey', (err, authData)=>{
    if(err){
      res.json({"message":"You are not authorized to perform this operation"});
    }res.json({
      mesage:'Post Created',
      authData
    });
  });

})

app.post('/api/insert',  verifyToken, (req,res)=>{
  jwt.verify(req.token, 'mySecretKey', (err, authData)=>{
    const { email, username, password, DOB, role} = req.body;
    if(err){
      res.json({"message":"You are not authorized to perform this operation"});
    }else{
      (async function addUser(){
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('Connected Successfully to the SERVER!!!');

          const db = client.db(dbName);

          const col  = await db.collection('users');
          const user = {email, username, password, DOB, role};
          const results = await col.insertOne(user);
          debug(results);
          if(results.ops[0]){
            res.json({"success": "The user is created successfully",authData},
            );
            //res.redirect('/auth/profile');
          }
        }catch(err){
          debug(err.stack);
          res.json({"message": "Record insertion failed! Please contact your admin"});
        }
        client.close();
      }())
    }
  });
})

app.post('/api/delete',  verifyToken, (req,res)=>{
  jwt.verify(req.token, 'mySecretKey', (err, authData)=>{
    const queryObject = req.body;
    debug(queryObject);
    if(err){
      res.json({"message":"You are not authorized to perform this operation"});
    }else{
      (async function deleteUser(){
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('Connected Successfully to the SERVER!!!');

          const db = client.db(dbName);

          const col  = await db.collection('users');
          debug(queryObject);
          const results = await col.deleteOne(queryObject);
          debug(results);
          debug('deleted');
          debug(results.deletedCount);
          if(results.deletedCount){
            res.json({"success": "The record is deleted successfully",authData},
            );
          }else{
            res.json({"success": "The record is not found",authData},
            );
          }
        }catch(err){
          debug(err.stack);
          res.json({"message": "Record deletion failed! Please contact your admin"});
        }
        client.close();
      }())
    }
  });
})

app.post('/api/update',  verifyToken, (req,res)=>{
  jwt.verify(req.token, 'mySecretKey', (err, authData)=>{
    const queryObject = req.body.where;
    const newValues = req.body.newValues;
    debug(newValues);
    debug(queryObject);
    if(err){
      res.json({"message":"You are not authorized to perform this operation"});
    }else{
      (async function updateUser(){
        let client;
        try {
          client = await MongoClient.connect(url);
          debug('Connected Successfully to the SERVER!!!');

          const db = client.db(dbName);

          const col  = await db.collection('users');
          debug(queryObject);
          const results = await col.updateOne(queryObject, {$set: newValues});
          debug(results);
          debug('updated');
          debug(results.modifiedCount);
          if(results.modifiedCount){
            res.json({"success": "The record is updated successfully",authData},
            );
          }else{
            res.json({"success": "The record is not found",authData},
            );
          }
        }catch(err){
          debug(err.stack);
          res.json({"message": "Record updation failed! Please contact your admin"});
        }
        client.close();
      }())
    }
  });
})

app.post('/auth/register', (req,res)=>{
  const { email, username, password, DOB, role} = req.body;
  console.log(req.body);
  //res.json({"success": "The user is created successfully"});

  (async function addUser(){
    let client;
    try {
      client = await MongoClient.connect(url);
      debug('Connected Successfully to the SERVER!!!');

      const db = client.db(dbName);

      const col  = await db.collection('users');
      const user = {email, username, password, DOB, role};
      const results = await col.insertOne(user);
      debug(results);
      if(results.ops[0]){
        res.json({"success": "The user is created successfully"});
        //res.redirect('/auth/profile');
      }
    }catch(err){
      debug(err.stack);
      res.json({"message": "Creating user failed! Please contact your admin"});
    }
    client.close();
  }())
})

app.post('/auth/login', (req,res)=>{
  debug(req.body);
    const { username, password } = req.body;
    console.log(req.body);

    (async function getUser(){
      let client;
      try {
        client = await MongoClient.connect(url);
        debug('Connected Successfully to the SERVER!!!');

        const db = client.db(dbName);

        const col  = await db.collection('users');
        const userResult = await col.findOne({ username: username, password: password});
        debug(userResult);
        if(userResult){
          jwt.sign({user: userResult}, 'mySecretKey', (err, token)=>{
            res.json({
              token,
              "message":"Success"
            });
          });
        }else{
          res.send('could not find user! Please contact your admin');
        }
      }catch(err){
        debug(err.stack);
        res.send('could not find user! Please contact your admin');
      }
      client.close();
    }())
})

//FORMAT OF TOKEN
// Authorization: Bearer <access_token>

function verifyToken(req, res, next){
  const bearerHeader = req.headers['authorization'];
  if(typeof bearerHeader !== 'undefined'){
    //split at space
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  }else{
    //forbidden
    res.sendStatus(403);
    //res.json({"message":"forbidden"});
  }
}

app.listen(port, () => {
  debug(`Listening to port ${chalk.green(port)}`);
});