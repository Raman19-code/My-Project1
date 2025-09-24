const express = require('express');   // must be first
const app = express();                 // must be defined
const PORT = 3000;

const seats = {
  1: { status: 'available', lockExpiry: null },
  2: { status: 'available', lockExpiry: null },
  3: { status: 'available', lockExpiry: null },
  4: { status: 'available', lockExpiry: null },
  5: { status: 'available', lockExpiry: null },
  6: { status: 'available', lockExpiry: null }
};

const LOCK_DURATION = 60000;

app.use(express.json());

// GET all seats
app.get('/seats', (req, res) => {
  res.status(200).json(seats);
});

// POST lock seat
app.post('/lock/:seatId', (req, res) => {
  const seatId = parseInt(req.params.seatId.trim());
  const seat = seats[seatId];

  if (!seat) return res.status(404).json({ message: "Seat not found." });
  if (seat.status !== 'available') return res.status(409).json({ message: "Seat is already locked or booked." });

  seat.status = 'locked';
  seat.lockExpiry = Date.now() + LOCK_DURATION;

  setTimeout(() => {
    if (seats[seatId].status === 'locked' && seats[seatId].lockExpiry <= Date.now()) {
      seats[seatId].status = 'available';
      seats[seatId].lockExpiry = null;
    }
  }, LOCK_DURATION);

  res.status(200).json({ message: `Seat ${seatId} locked successfully. Confirm within 1 minute.` });
});

// POST confirm seat
app.post('/confirm/:seatId', (req, res) => {
  const seatId = parseInt(req.params.seatId.trim());
  const seat = seats[seatId];

  if (!seat) return res.status(404).json({ message: "Seat not found." });
  if (seat.status === 'locked' && seat.lockExpiry > Date.now()) {
    seat.status = 'booked';
    seat.lockExpiry = null;
    return res.status(200).json({ message: `Seat ${seatId} booked successfully!` });
  } else {
    return res.status(400).json({ message: "Seat is not locked and cannot be booked." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
