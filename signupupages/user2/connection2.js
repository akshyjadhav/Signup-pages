const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');



const app = express();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'mysignup'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Database');
});


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'signupupages/user1/signup');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'signup.html'));
});
const userNumbers = [5, 6, 7, 8, 9];
        const missedNumbers = [];

        


app.post('signup2', upload.array('documents'), async (req, res) => {
    try {
        const { name, email, mobile, password } = req.body;
        const Password = await bcrypt.hash(password, 10);
        
        
        const documents = req.files.map(file => file.filename).join(","); 

        
        const query = `INSERT INTO user1 (name, email, mobno, password, doc) VALUES (?, ?, ?, ?, ?)`;
        db.query(query, [name, email, mobile, password, documents], (err, result) => {
            if (err) throw err;
            res.redirect(`/success/${result.insertname}`); 
        });

    } catch (err) {
        res.status(500).send("Error saving user: " + err.message);
    }

    db.query('SELECT password FROM user1 WHERE name = ?', (err, result) => {
        if (err) throw err;

        if (result.length > 0) {
            const firstUserMobile = result[0].password;

            
            userNumbers.forEach(num => {
                if (!firstUserMobile.includes(num.toString())) {
                    missedNumbers.push(num);
                }
            });
        }

        
        res.render('confirmation', { name, email, mobile, missedNumbers });
});

app.get('/success/:name', (req, res) => {
    const userId = req.params.name;
    const query = 'SELECT * FROM user1 WHERE name = ?';

    db.query(query, [userId], (err, result) => {
        if (err) throw err;

        if (result.length === 0) {
            return res.status(404).send("User not found");
        }

        const user = result[0];
        const doclink = user.documents.split(',').map(doc => `<a href="signupupages/user1/signup/${doc}">${doc}</a>`).join(', ');

       
        res.send(`
            <h1>Success! Here is the data you submitted:</h1>
            <p><strong>Name:</strong> ${user.name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Mobile:</strong> ${user.mobno}</p>
            <p><strong>Documents:</strong> ${doclink}</p>
        `);
    });
});


app.use('signupupages/user1/signup', express.static('uploads'));
app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
});