const express = require('express')
const cors = require('cors')
const admin = require('firebase-admin');
const inspect = require('util').inspect;
const Busboy = require('busboy');
const path = require('path');
const os = require('os');
const fs = require('fs');
const {v4:uuid4} =require('uuid');

const port = 3000

const app = express()
app.use(cors())

//#region firebase config
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'pwa-quasar-vue.appspot.com'
});

const db = admin.firestore();
const bucket = admin.storage().bucket();
//#endregion

//#region api endpoints
app.get('/api', (req, res) => {
  res.send('Welcome to Quasagram API')
})

app.get('/api/posts', (req, res) => {
  const posts = [];

  db.collection("posts")
    .orderBy("date", "desc").get().then((snapshot) => {
      snapshot.forEach((doc) => {
        posts.push(doc.data());
      });
      res.send(posts);
    })
    .catch(() => {

    });
})

app.get('/api/products', (req, res) => {
  const products = [];

  db.collection("products").get().then((snapshot) => {
      snapshot.forEach((doc) => {
        products.push(doc.data());
      });
      res.send(products);
    })
    .catch(() => {

    });
})

app.post('/api/products/create', (req, res) => {
  const busboy = new Busboy({ headers: req.headers });
  const fields = {};
  let filedata = {};
  const uuid = uuid4();
  busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
    console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
    const filepath = path.join(os.tmpdir(), filename);
    file.pipe(fs.createWriteStream(filepath));
    filedata = { filepath, mimetype };
  });
  busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
    console.log('Field [' + fieldname + ']: value: ' + inspect(val));
    fields[fieldname] = val;
  });
  busboy.on('finish', function () {
    console.log('Done parsing form!');
    bucket.upload(filedata.filepath, {
        uploadType: 'media',
        metadata: {
          metadata: {
            contentType: filedata.mimetype,
            firebaseStorageDownloadTokens: uuid
          }
        }
      },
      (err, uploadedFile) => {
        if(!err){
          createDocument(uploadedFile);
        }
      })

      function createDocument(uploadedFile){
        db.collection('products').doc(fields.id).set({
          id: fields.id,
          name: fields.name,
          availableLocation: fields.location,
          price: +fields.price,
          imageUrl: `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${uploadedFile.name}?alt=media&token=${uuid}`,
        }).then(() => {
          res.send('Product added: ' + fields.id)
        });
      }
    // res.writeHead(303, { Connection: 'close', Location: '/' });
    // res.send('Done parsing form!');
  });
  req.pipe(busboy);

  // response.send(req.headers)
})

//#endregion

app.listen(process.env.PORT || port, () => {
  console.log(`App listening at ${port}`)
})