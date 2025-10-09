const router = express.Router();

router.use((req, res, next) => {
  console.log('Admin router middleware executed');
  next();
});

router.get('/dashboard', (req, res) => {
  res.send('Admin dashboard');
});

app.use('/admin', router);