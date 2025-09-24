// app.js
const express = require('express');
const app = express();
const port = 3000;

// Middleware to read JSON body
app.use(express.json());

// In-memory cards collection
let cards = [
  { id: 1, suit: "Hearts", value: "Ace" },
  { id: 2, suit: "Spades", value: "King" },
  { id: 3, suit: "Diamonds", value: "Queen" }
];

// 1. GET all cards
app.get('/cards', (req, res) => {
  res.json(cards);
});

// 2. GET card by ID
app.get('/cards/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const card = cards.find(c => c.id === id);

  if (card) {
    res.json(card);
  } else {
    res.status(404).json({ message: "Card not found" });
  }
});

// 3. POST a new card
app.post('/cards', (req, res) => {
  const { suit, value } = req.body;

  if (!suit || !value) {
    return res.status(400).json({ message: "Suit and value are required" });
  }

  const newCard = {
    id: cards.length + 1,
    suit,
    value
  };

  cards.push(newCard);
  res.status(201).json(newCard);
});

// 4. DELETE card by ID
app.delete('/cards/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = cards.findIndex(c => c.id === id);

  if (index !== -1) {
    const removed = cards.splice(index, 1);
    res.json({ message: "Card deleted", card: removed[0] });
  } else {
    res.status(404).json({ message: "Card not found" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
