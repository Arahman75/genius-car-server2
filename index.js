const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const app = express();
const cors = require('cors');
var jwt = require('jsonwebtoken');
require('dotenv').config();
const port = process.env.PORT || 5000;

//middle ware

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.f3jci.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
//  console.log('user connected dbpass dbuser', uri);

async function run() {

    try {
        await client.connect();

        const serviceCollection = client.db('geniusCar').collection('service');
        const orderCollection = client.db('geniusCar').collection('order');

// auth jwt token system
app.post('/login', async(req, res)=>{
    const user = req.body;
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET,{
        expiresIn: '1d'
    })
    res.send({accessToken});
})

        // services api
        // get data from mongodb server all data
        app.get('/service', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })
        // get a single data from mongodb

        app.get('/service/:id', async (req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service);

        })

        // post
        app.post('/service', async(req, res)=>{
            const newService = req.body;
            const result = await serviceCollection.insertOne(newService);
            res.send(result);
        })

        // Delete 
        app.delete('/service/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await serviceCollection.deleteOne(query);
            res.send(result);
        });

        // order collection api

        // data get from order
app.get('/order', async(req, res)=>{
    const email = req.query.email;
    const query ={email: email};
    const cursor = orderCollection.find(query);
    const orders = await cursor.toArray();
    res.send(orders);
})

        // data post from order
        app.post('/order', async(req, res)=>{
            const order = req.body;
            const result = await orderCollection.insertOne(order);
            res.send(result);
        })


    }
    finally {

    }

}
run().catch(console.dir);

// async function run() {
//  try{
//     await client.connect();

//     const serviceCollection = client.db('geniusCar').collection('service');

//     app.get('/service', async(req, res)=>{
//         const query = {};
//         const cursor = serviceCollection.find(query);
//         const services = await cursor.toArray();
//         res.send(services);
//     })
//  }

//  finally{
//     // await client.close();
//  }
// }
// run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Showing the genius car service');
})

app.listen(port, () => {
    console.log('genius service running', port)
})




