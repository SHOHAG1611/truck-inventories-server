const express = require('express')
const cors = require('cors')
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

// middlewar
app.use(cors())
app.use(express.json());

// load data from mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.nowqz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect()
        const trucksCollection = client.db("trucksInventories").collection("trucks");
        // show trucks inventories
        app.get('/truck', async (req, res) => {
            const query = {};
            const cursor = trucksCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        });
        // single truck details when click in update button
        app.get('/truck/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await trucksCollection.findOne(query)
            res.send(result)
        })
        // Post or create  data in add item route
        app.post('/truck', async (req, res) => {
            const item = req.body;
            const result = await trucksCollection.insertOne(item)
            res.json(result);
        })
        // my items
        app.get('/myProduct', async (req, res)=>{
            const email=req.query.email;
            console.log(email)
            const query = {email:email}
            const cursor= trucksCollection.find(query)
            const result= await cursor.toArray();
            res.json(result);
        })
        // delete from manageInventories
        app.delete('/truck/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await trucksCollection.deleteOne(query);
            res.send(result);
        })
        // update
        app.put('/truck/:id', async (req, res) => {
            const quantity = req.body.totalQuantity;
            console.log(quantity)
            const id = req.params.id
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: { quantity: quantity },
            }
            const result = await trucksCollection.updateOne(filter, updateDoc, options);
            res.json(result)
        })
    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir)

// test api
app.get('/', (req, res) => {
    res.send('server is running')
})

app.listen(port, () => {
    console.log('server is running', port);
})

// https://stackoverflow.com/questions/72238537/why-i-dont-get-req-and-res-in-my-website
