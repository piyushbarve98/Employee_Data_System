const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');


//connecting to sql database
const con = mysql.createConnection({
    host:'localhost',
    user:'root',
    database:'empDB'
});

con.connect((err)=>{
    if(err){
        throw err;
    }
    else{
        console.log('Connected..');
    }
});
//connection done


// create the app variable 


let app = express();

app.set('view engine','ejs');
let urlencoded = bodyParser.urlencoded({ extended: false });

app.use('/assets',express.static('assets'));

// function for entry of data into database
function empData(data,req,res){
    var sql = `SELECT * FROM employee WHERE email='${data.email}'`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        else if(result.length>0){
            res.send('Email Exists try a different Email');
        }
        else{
            var sql=`INSERT INTO employee (name,email,age,salary)  VALUES ('${data.name}','${data.email}',${data.age},${data.salary})`;
            con.query(sql, function (err, result) {
            if (err) throw err;
            console.log('data inserted');
            res.render('nameId.ejs');
      });

        }
      });
    

}

// function for getting data from database and show it to ejs template

function getData(data,req,res){
    var sql = `SELECT * FROM employee WHERE name='${data.name}' AND email='${data.email}'`;

    con.query(sql, function (err, result) {
        if (err) throw err;
        else if(result.length==0){
            res.send('Data not found');
        }
        else{
            res.render('info.ejs',{info:result[0]});
        }
      });

}

// function for deleting data from database

function delfunc(req,res){
    data= req.body;
    var sql = `DELETE FROM employee WHERE name='${data.name}' AND email='${data.email}' AND '${data.code}'='abcd'`;
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.send('Data deleted');
      });

}
app.get('/',(req,res)=>{
    res.render('homePage.ejs');
});
app.get('/home',(req,res)=>{
    res.render('homePage.ejs');
});
app.post('/form-data',urlencoded,(req,res)=>{
    empData(req.body,req,res);
    
});

app.get('/empInsert',(req,res)=>{
    res.render('empInsert.ejs');
});


app.get('/nameId',(req,res)=>{
    res.render('nameId.ejs');
});

app.post('/get-data',urlencoded,(req,res)=>{
    getData(req.body,req,res);
});

app.get('/deleteEmployee',(req,res)=>{
    res.render('deleteEmployee.ejs');
});

app.post('/del-data',urlencoded,(req,res)=>{
    delfunc(req,res);
});
app.listen(3200,()=>{
    console.log('listening to server 3200...')
});