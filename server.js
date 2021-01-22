require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const passport = require('passport');

const blogRoutes = require('./routes/blogRoutes');

// Connect to database
mongoose.connect(
  process.env.MONGODB_URI,
  {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  console.log('Connection to Mongo DB established')
);

// Listen to port
const port = process.env.PORT || 3000;
app.listen(port, console.log(`Listening to port ${port}`));

// Middleware
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

// Routes
app.get('/', (req, res) => {
  res.redirect('/blogs');
});
app.use('/blogs', blogRoutes);
