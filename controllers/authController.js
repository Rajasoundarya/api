const { MongoClient, ObjectID } = require('mongodb');
const jwt =  require('jsonwebtoken');
const debug = require('debug') ('app:authController');
const url = 'mongodb://localhost:27017';
const dbName = 'MyFirstApp';


function authController(){
  function createUser(req, res){
    debug(req);
    //const { email, username, password, DOB, role} = req.body;
    console.log(req.body);
    res.json({"success": "The user is created successfully"});

    // (async function addUser(){
    //   let client;
    //   try {
    //     client = await MongoClient.connect(url);
    //     debug('Connected Successfully to the SERVER!!!');

    //     const db = client.db(dbName);

    //     const col  = await db.collection('users');
    //     const user = {email, username, password, DOB, role};
    //     const results = await col.insertOne(user);
    //     debug(results);
    //     req.login(results.ops[0], ()=>{
    //       res.json({"success": "The user is created successfully"});
    //       //res.redirect('/auth/profile');
    //     })
    //   }catch(err){
    //     debug(err.stack);
    //     res.json({"message": "Creating user failed! Please contact your admin"});
    //   }
    //   client.close();
    // }())
  }
  // function loginUser(req, res){
  //   debug(req.body);
  //   const { username, password } = req.body;
  //   console.log(req.body);

  //   (async function getUser(){
  //     let client;
  //     try {
  //       client = await MongoClient.connect(url);
  //       debug('Connected Successfully to the SERVER!!!');

  //       const db = client.db(dbName);

  //       const col  = await db.collection('users');
  //       const userResult = await col.findOne({ username: username, password: password});
  //       debug(userResult);
  //       req.login(userResult, ()=>{
  //         //res.send("success: The user is found successfully");

  //         jwt.sign({user: userResult}, 'mySecretKey', (err, token)=>{
  //           res.json({
  //             token
  //           });
  //         });
  //         //res.redirect('/auth/profile');
  //       })
  //     }catch(err){
  //       debug(err.stack);
  //       res.send('could not find user! Please contact your admin');
  //     }
  //     client.close();
  //   }())

  // }
  return {
    createUser
    //loginUser
  };
}

module.exports =  authController;