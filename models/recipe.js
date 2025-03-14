const mongoose = require('mongoose');

const RecipeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    ingredients: [{
         amount: { type: String, required: true }, 
         name: { type: String, required: true } 
        }],
    instructions: [{ type: String, required: true }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    imageUrl: { type: String }, 
    imagePath: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Recipe', RecipeSchema);