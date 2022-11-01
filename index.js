const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const app = express();
const cors = require('cors');
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




