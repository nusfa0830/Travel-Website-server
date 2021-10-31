const express = require("express");
const app = express();
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())

// mongodb connect
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.8yl3g.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// console.log(uri);
async function run() {
    try {
        await client.connect();
        console.log('connect database')
        const database = client.db('travel_site');
        const travelCollection = database.collection('tours');

        //  all booked tour collection

        const tourCollection = database.collection('addTour');

        //  my order collection
        const bookingCollection = database.collection('myBooking');







        //get all tours
        app.get('/tours', async (req, res) => {
            const cursor = travelCollection.find({});
            const tours = await cursor.toArray();
            res.send(tours);
        })

        // getting adding element
        app.post('/addtour', async (req, res) => {

            const result = await travelCollection.insertOne(req.body);
            res.send(result.insertedId);
        })



        // all booked tour
        app.post("/addtour/:id", async (req, res) => {

            const result = await tourCollection.insertOne(req.body);
            res.send(result);

        })

        app.get("/addtour", async (req, res) => {
            console.log(req)
            const result = await tourCollection.find({}).toArray();
            res.send(result);
            // console.log(result)
        });




        // getting add booking
        app.post("/addTour", async (req, res) => {
            // console.log(req.body);
            const result = await tourCollection.insertOne(req.body);
            res.send(result.insertedId);
        })


        // get all booking 
        app.get("/booking", async (req, res) => {
            // console.log(req)
            const result = await tourCollection.find({}).toArray();

            res.send(result);
        })
        // delete booking

        app.delete("/booking/:id", async (req, res) => {

            const result = await tourCollection.deleteOne({ _id: ObjectId(req.params.id) });


        })


        // posting my booking
        app.post('/addMyBooking', async (req, res) => {
            const result = await bookingCollection.insertOne(req.body);
            res.send(result)

        })


        // gettting my booking 
        app.get('/mybooking/:email', async (req, res) => {
            const result = await bookingCollection.find({ email: req.params.email }).toArray();
            res.send(result);
            console.log(result)

        })


        // delete api from manage evnts
        app.delete("/addTour/:id", async (req, res) => {
            const id = req.params.id;

            const query = { _id: ObjectId(id) }
            const result = await tourCollection.deleteOne(query);
            // console.log(result)

        })

    }
    finally {
        // await client.close();
    }


}

run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('running travel site');
})
app.listen(port, () => {
    console.log('travel site', port)
})