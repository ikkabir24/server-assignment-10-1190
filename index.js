const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const categoryCollection = db.collection('categories');

        // GET: all the categories
        app.get('/categories', async (req, res) => {
            const cursor = categoryCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        // POST: new course publish (Create)
        app.post('/courses', async (req, res) => {
            const newCourse = req.body;
            const result = await courseCollection.insertOne(newCourse);
            res.send(result);
        })

        // GET: get all the courses (Read)
        app.get('/courses', async (req, res) => {
            const { category } = req.query;

            const filter = {};
            if (category) {
                filter.category = category;
            }

            const cursor = courseCollection.find(filter);
            const result = await cursor.toArray();
            res.send(result);
        });



        // PATCH: update an existing product (Update)
        app.patch('/courses/:id', async (req, res) => {
            const id = req.params.id;
            const updatedCourse = req.body;
            const query = { _id: new ObjectId(id) };

            const update = {
                $set: updatedCourse,
            }

            const result = await courseCollection.updateOne(query, update);
            res.send(result);
        })

        // DELETE: delete a existing course (Delete)
        app.delete('/courses/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await courseCollection.deleteOne(query);
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