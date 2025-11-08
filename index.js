const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vtjw1lo.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

app.get('/', (req, res) => {
    res.send('assignment 10 server is running...')
})

async function run() {
    try {
        await client.connect();

        const db = client.db('assignment-10')
        const courseCollection = db.collection('courses');

        // POST: new course publish (Create)
        app.post('/courses', async (req, res) => {
            const newCourse = req.body;
            const result = await courseCollection.insertOne(newCourse);
            res.send(result);
        })




        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }
    finally {

    }
}

run().catch(console.dir)

app.listen(port, () => {
    console.log(`assignment 10 server is running on port: ${port}`)
})