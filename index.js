const express = require('express')
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const bodyParser = require('body-parser')
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kz5wbn2.mongodb.net/e-variety?retryWrites=true&w=majority`;



const app = express()
const port = 4400

app.use(cors())
app.use(bodyParser.json())

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const evarietyCollection = client.db("e-variety").collection("variety-products");
  const evarietyOrderCollection = client.db("e-variety").collection("variety-orders");
  // perform actions on the collection object
  console.log('databse connected successfully!!');

    app.post('/addproducts', (req,res)=>{
        const body = req.body;
        evarietyCollection.insertOne(body)
        .then(result=>{
            res.send(result.acknowledged);
            
        })
    })

    app.get('/allproducts',(req,res)=>{
      evarietyCollection.find()
      .toArray((err,documents)=>{
        res.send(documents);
      })
    })

    app.post('/order',(req,res)=>{
      const productOrder = req.body;
      evarietyOrderCollection.insertOne(productOrder)
      .then((result)=>{
        res.send(result.acknowledged);
        console.log("order placed successfully")
      })
    })

    app.get("/getorder", (req,res)=>{
      evarietyOrderCollection.find()
      .toArray((err,documents)=>{
        res.send(documents)
        console.log('one order got ')
      })
    })

    app.delete("/product/:id", (req,res)=>{
      const id = ObjectId(req.params.id);
      evarietyCollection.findOneAndDelete({_id:id})
      .then((err,documents)=>{
        res.send(documents);
      })
    })




});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port, () => {
  console.log(`Example app listening on port ${port}`)
})