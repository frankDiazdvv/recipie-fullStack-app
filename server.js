const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const recipeRoutes = require('./routes/recipeRoutes');

dotenv.config();
const app = express();

//middleware
app.use(cors()); //allows backend to get requests from different domains.
app.use(express.json()); //allows incomming JSON req.body to become a JS object.

//Connection to mongoDB
mongoose.connect(process.env.MONGO_URI).then(() => console.log("MongoDB connected!")).catch(
    err => console.error("Connection to MongoDB failed!", err)
);

app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);

//Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

