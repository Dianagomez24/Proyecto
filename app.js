const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const { body, validationResult } = require('express-validator');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.log('Error:', err));

const ItemSchema = new mongoose.Schema({
    dato: String,
    fecha: { type: Date, default: Date.now }
});

const Item = mongoose.model('Item', ItemSchema);

app.get('/', async (req, res) => {
    const items = await Item.find();
    res.render('index', { items });
});

app.post('/api/items',
    body('dato').trim().escape(),
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).send("Dato inválido");
        }

        const item = new Item({ dato: req.body.dato });
        await item.save();
        res.redirect('/');
    }
);

app.get('/api/items/:id', async (req, res) => {
    const item = await Item.findById(req.params.id);
    res.json(item);
});

app.put('/api/items/:id',
    body('dato').trim().escape(),
    async (req, res) => {
        await Item.findByIdAndUpdate(req.params.id, { dato: req.body.dato });
        res.json({ ok: true });
    }
);

app.delete('/api/items/:id', async (req, res) => {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
});

app.listen(3000, () => {
    console.log('Servidor en http://localhost:3000');
    console.log('APP SEGURA');
});
