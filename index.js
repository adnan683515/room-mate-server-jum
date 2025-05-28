const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())


// username : room_mate_j
// pass : UB5YUoX8K48FIeDz



const uri = "mongodb+srv://room_mate_j:UB5YUoX8K48FIeDz@cluster0.ws0fker.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        await client.connect();

        const allRoomMatescollections = client.db('mates').collection('mate')

        app.post('/roomatesPost', async (req, res) => {
            const info = req.body

            const result = await allRoomMatescollections.insertOne(info)
            res.send(result)
        })
        app.get('/allroommates', async (req, res) => {
            const query = { Aavailable: 'available' }
            const allData = await allRoomMatescollections.find(query).limit(6).toArray()
            res.send(allData)
        })
        app.get('/allRoomatesBroweList', async (req, res) => {
            const data = await allRoomMatescollections.find().toArray()
            res.send(data)
        })
        app.get('/Detailsroom/:id', async (req, res) => {
            const uid = req.params.id
            const query = { _id: new ObjectId(uid) }
            const result = await allRoomMatescollections.findOne(query)
            res.send(result)
        })
        app.get('/mylist/:email', async (req, res) => {
            const email = req.params.email
            const query = { email: email }
            const result = await allRoomMatescollections.find(query).toArray()
            res.send(result)
        })

        app.delete('/delete/:id', async (req, res) => {
            const query = { _id: new ObjectId(req.params.id) }
            const result = await allRoomMatescollections.deleteOne(query)
            res.send(result)
        })

        app.put('/update/:id', async (req, res) => {
            const uid = req.params.id
            const info = req.body
            const query = { _id: new ObjectId(uid) }
            const updateDoc = {
                $set: {
                    ...info
                },
            };
            const options = { upsert: true };
            const result = await allRoomMatescollections.updateOne(query, updateDoc, options);
            res.send(result)
        })

        app.patch('/roommates/:id', async (req, res) => {
            const UPid = req.params.id
            const query = {
                _id: new ObjectId(UPid)
            };
            const updateDocument = {
                $inc: {
                    like: 1
                }
            };
            const result = await allRoomMatescollections.updateOne(query, updateDocument)
            res.send(result)
        })


        app.get('/allMatess/:search', async (req, res) => {
            const value = req.params.search;
            try {
                const result = await allRoomMatescollections
                    .find({ loc: { $regex: value, $options: 'i' } })
                    .toArray();
                res.send(result);
            } catch (error) {
                console.error("searching value failed", error);
                res.status(500).send({ message: "Internal Server Error" });
            }
        });




        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send("room mate j server side is running")
})

app.listen(port, () => {
    console.log(`server side is runnig ${port}`)
})
