
const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const app = express();
app.use(bodyParser.json({ type: "application/json" }));
app.use(bodyParser.urlencoded({ extended: true }));
const config=require("./config.json");
const con=mysql.createConnection(config.connection);
app.listen(3000, () => {
  console.log("Listening on localhost:3000");
});

con.connect(function(error) {
  if (error) console.log(error);
  else console.log("connected");
});
app.post("/conf", function(req, res) {
  //con.query(`SELECT * FROM import_req where username='${req.body.username}' and accepted=0 and arrival_date is null`, function(error, results) {
    con.query(`Call conf_req(?)`,[req.body.username], function(error, results) {
  if (error) throw error;
    //console.log(results);
    res.send(results);
  });
});
app.get("/abc", function(req, res) {
  con.query(`Call notification_req(?)`,['muthu'] ,function(error, results) {
    if (error) throw error;
    //console.log(results);
    res.send(results);
  });
});

app.post("/auth", function(req, res) {
  const sql=`Call authenticate(?,?)`;
  //const sql = `Select * from user_login where username='${req.body.username}' and password='${req.body.password}'`;
  
  //console.log(sql);
  con.query(sql,[req.body.username,req.body.password], function(err, results) {
    if (err) throw err;
    else {
      //console.log(results.length);
      if (results[0].length > 0) res.send("True");
      else res.send("False");
    }
  });
});
app.post("/rej", function(req, res) {
  const sql = `update import_req set accepted=2 where container_no='${req.body.con_no}'`;
  //console.log(sql);
  con.query(sql, function(err, results) {
    if (err) throw err;
     res.send("done");
  });
});
app.post("/driver_details", function(req, res) {
  //const sql = `insert into driver_details (container_no,driver_name,mobile_number,truck_no,round_trip) values
  //('${req.body.container_no}','${req.body.name}','${req.body.mob_no}','${req.body.truck_no}','${req.body.round_trip}') `;
  const sql=`Call driver_details_insertion(?,?,?,?,?)`;
  //console.log(sql);
  const sql1 = `update import_req set accepted=1 where container_no='${req.body.container_no}'`;
  //r;console.log(sql);
  con.query(sql1, function(err, results) {
    if (err) throw err;});
  con.query(sql,[req.body.container_no,req.body.name,req.body.mob_no,req.body.truck_no,req.body.round_trip], function(err, results) {
    if (err) throw err;
     res.send("done");
  });
});
app.post("/req", function(req, res) {
  /*con.query(`SELECT * FROM import_req where username='${req.body.username}' and accepted=1 and arrival_date is NULL`, function(error, results,) {
    if (error) throw error;
    res.send(results);*/
    con.query(`Call notification_req(?)`,[req.body.username] ,function(error, results) {
      if (error) throw error;
      //console.log(results);
      res.send(results);
  });
});
app.post("/driv", function(req, res) {
  con.query(`SELECT * FROM driver_details where container_no='${req.body.container_no}'`, function(error, results,) {
    if (error) throw error;
    res.send(results);
  });
});
app.post("/date", function(req, res) {
  const sql = `update import_req set arrival_date='${req.body.actualDate}' , arrival_time='${req.body.actualTime}' where container_no='${req.body.con_no}'`;
  //console.log(sql);
  con.query(sql, function(err, results) {
    if (err) throw err;
     res.send("done");
  });
});
app.post("/history", function(req, res) {
  const sql = `Select *,DATEDIFF(CURRENT_DATE(),dop) as diff from import_req where DATEDIFF(CURRENT_DATE(),dop)<7 and username='${req.body.username}' and arrival_date is not null`;
  //console.log(sql);
  con.query(sql, function(err, results) {
    if (err) throw err;
     res.send(results);
  });
});