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

app.get('/users', (req, res) => {
    client.query(`Select * from users`, (err, result) => {
        if (!err) {
            res.send(result.rows);
        }
    });
    client.end;
})


app.get('/users/:id', (req, res) => {
    client.query(`Select * from users where id=${req.params.id}`, (err, result) => {
        if (!err) {
            res.send(result.rows);
        }
    });
    client.end;
})


const bodyParser = require("body-parser");
app.use(bodyParser.json())

app.post('/users', (req, res) => {
    const user = req.body;
    let insertQuery = `INSERT INTO public.users(
        id, firstname, lastname, phone)
        VALUES (${user.id}, '${user.firstname}', '${user.lastname}', '${user.phone}')`

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


app.post('/users/login', (req, res) => {
    const user = req.body;
    
    // if (!user.firstname || !user.lastname) {
    //     return res.status(400).json({ message: 'namanya are required'});
    // }

    let checkfirst = `select firstname from users where firstname = '${user.firstname}'`
    

    // const passwordMatch = await compare(password, user.password);

    // if (!passwordMatch) {
    //     return res.status(401).json({ message: 'Invalid email or password' });
    // }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
        


    client.query(checkfirst, (err, result) => {
        if (!err) {
            res.send('Insertion was successful')
            console.log(result.rows)
            console.log(token)
            // res.status(200).json({ message: token });
        }
        else { 
            console.log(err.message);
            res.status(401).send({ message: 'Invalid email or password' });
            res.status(500).send('Error inserting user');
        
        }
    })
    client.end;
})



app.put('/users/:id', (req, res)=> {
    let user = req.body;
    let updateQuery = `update users
                       set firstname = '${user.firstname}',
                       lastname = '${user.lastname}',
                       phone = '${user.phone}'
                       where id = ${user.id}`

    client.query(updateQuery, (err, result)=>{
        if(!err){
            res.send('Update was successful')
        }
        else{ console.log(err.message) }
    })
    client.end;
})


app.delete('/users/:id', (req, res)=> {
    let insertQuery = `delete from users where id=${req.params.id}`

    client.query(insertQuery, (err, result)=>{
        if(!err){
            res.send('Deletion was successful')
        }
        else{ console.log(err.message) }
    })
    client.end;
})



client.connect();