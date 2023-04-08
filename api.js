const jwt = require('jsonwebtoken')
const client = require('./connection.js')
const express = require('express');
const app = express();
const JWT_SECRET = "your-secret-key"

const cors = require('cors')

app.listen(3300, () => {
    console.log("Sever is now listening at port 3300");
})

app.use(cors())


app.get('/pesawat', (req, res)=>{
    client.query(`Select * from pesawat`, (err, result)=>{
        if(!err){
            res.send(result.rows);
        }
    });
    client.end;
})

//select id
app.get('/pesawat/:id', (req, res)=>{
    client.query(`Select * from pesawat where id=${req.params.id}`, (err, result)=>{
        if(!err){
            res.send(result.rows);
        }
    });
    client.end;
})


const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())

app.post('/pesawat/register', (req, res)=> {
    const pesawats = req.body;
    let insertQuery = `INSERT INTO public.pesawat(namapesawat, asal, tujuan, kelas, tanggalberangkat, tanggalpulang, harga)
    VALUES ('${pesawats.namapesawat}', '${pesawats.asal}', '${pesawats.tujuan}', '${pesawats.kelas}', '${pesawats.tanggalberangkat}', '${pesawats.tanggalpulang}', '${pesawats.harga}')`

    client.query(insertQuery, (err, result)=>{
        if(!err){
            res.send('Insertion was successful')
        }
        else{ console.log(err.message) }
    })
    client.end;
})



app.put('/pesawat/update/:id', (req, res)=> {
    let pesawats = req.body;
    let updateQuery = `update pesawat
                       set namapesawat = '${pesawats.namapesawat}',
                       asal = '${pesawats.asal}',
                       tujuan = '${pesawats.tujuan}',
                       kelas = '${pesawats.kelas}',
                       tanggalberangkat = '${pesawats.tanggalberangkat}',
                       tanggalpulang = '${pesawats.tanggalpulang}',
                       harga = '${pesawats.harga}'
                       where id = ${req.params.id}`

    client.query(updateQuery, (err, result)=>{
        if(!err){
            res.send('Update was successful')
        }
        else{ console.log(err.message) }
    })
    client.end;
})


app.delete('/pesawat/delete/:id', (req, res)=> {
    let insertQuery = `delete from pesawat where id=${req.params.id}`

    client.query(insertQuery, (err, result)=>{
        if(!err){
            res.send('Deletion was successful')
        }
        else{ console.log(err.message) }
    })
    client.end;
})






app.delete('/users/:id', (req, res)=> {
    let insertQuery = `delete from datauser where id=${req.params.id}`

    client.query(insertQuery, (err, result)=>{
        if(!err){
            res.send('Deletion was successful')
        }
        else{ console.log(err.message) }
    })
    client.end;
})




app.get('/akun', (req, res) => {
    client.query(`Select * from userakun`, (err, result) => {
        if (!err) {
            res.send(result.rows);
        }
    });
    client.end;
})





app.post('/akun/register', (req, res) => {
    const user = req.body;
    console.log(user)
    console.log(user.id)
    let insertQuery = `INSERT INTO public.userakun(
        id, username, email, password)
        VALUES ('${user.id}', '${user.username}', '${user.email}', '${user.password}')`

    client.query(insertQuery, (err, result) => {
        if (!err) {
            res.send('Insertion was successful')
        }
        else { 
            console.log(err.message);
            res.status(500).send('Error inserting user');
        
        }
    })
    client.end;
})




app.post('/akun/login', (req, res) => {
    const user = req.body;
    let selectquery =   `SELECT id,email,password from userakun where email='${user.email}'and password='${user.password}'`

    client.query(selectquery, (err, result) => {
        try{
            const token = jwt.sign({ userId: result.rows[0]['id']}, JWT_SECRET, { expiresIn: '1h' });
            console.log(result.rows[0]['id'])
            if (!err) {
                res.send(token)
            }else{
                console.log(err.message);
                res.status(500).send('Error inserting user email');
            }
        }catch{
            console.log("salah akun bang")
            res.status(500).send('Error inserting user email');
            // res.send("salah akun")
        }

        
      
    })
    client.end;
})


app.get('/akun/cektoken',(req,res)=>{
    const userid = req.user.userId
    console.log(userid)
    const getuser =   `SELECT * FROM userakun where id='${userid}'`
    client.query(getuser,(err,result) => {
        const data = result.rows[0]
        try{
            if (!err) {
                res.status(200).json({data})
            }else{
                console.log(err.message);
                res.status(500).send('Error inserting token');
            }
        }catch{
            console.log("salah token bang")
        }
    })
})


client.connect();









// app.get('/users', (req, res) => {
//     client.query(`Select * from datauser`, (err, result) => {
//         if (!err) {
//             res.send(result.rows);
//         }
//     });
//     client.end;
// })


// app.get('/users/:id', (req, res) => {
//     client.query(`Select * from datauser where id=${req.params.id}`, (err, result) => {
//         if (!err) {
//             res.send(result.rows);
//         }
//     });
//     client.end;
// })





// app.post('/users', (req, res) => {
//     const user = req.body;
//     console.log(user)
//     console.log(user.id)
//     let insertQuery = `INSERT INTO public.datauser(
//         id, firstname, lastname, phone)
//         VALUES ('${user.id}', '${user.firstname}', '${user.lastname}', '${user.phone}')`

//     client.query(insertQuery, (err, result) => {
//         if (!err) {
//             res.send('Insertion was successful')
//         }
//         else { 
//             console.log(err.message);
//             res.status(500).send('Error inserting user');
        
//         }
//     })
//     client.end;
// })


// app.put('/users/:id', (req, res)=> {
//     let user = req.body;
//     let updateQuery = `update datauser
//                        set firstname = '${user.firstname}',
//                        lastname = '${user.lastname}',
//                        phone = '${user.phone}'
//                        where id = '${user.id}'`

//     client.query(updateQuery, (err, result)=>{
//         if(!err){
//             res.send('Update was successful')
//         }
//         else{ console.log(err.message) }
//     })
//     client.end;
// })