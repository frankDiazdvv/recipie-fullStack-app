const express = require('express');
const Recipe = require('../models/recipe');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

//Get all recipes
router.get('/', async (req, res) => {
    try{
        const recipes = await Recipe.find({createdBy: req.params.id}).populate('createdBy', 'username');
        res.json(recipes);
    }catch(err){
        res.status(400).json({ message: "Something Happened", error: err.message });
    }
});

//Create a Recipe
router.post('/', authMiddleware, async (req, res) => {
    try{
        const newRecipe = new Recipe({ ...req.body, createdBy: req.user.id });
        await newRecipe.save();
        res.json(newRecipe);
    }catch(err){
        res.status(400).json({ message: "Could not add a recipe", error: err.message });
    }
});

//Get recipe by id
router.get('/:id', authMiddleware, async (req, res) => {
    try{
        
        const recipe = await Recipe.findById(req.params.id);
        if(!recipe){
            return res.json({ error: "This ID does not exist!" });
        }
        res.json(recipe);


    }catch(err){
        res.status(400).json({ message: 'Error processing request' })
        console.error('Error fetching recipe', err);
    }
});

//Update Recipe by id
router.put('/:id', authMiddleware, async (req, res) => {
    try{
        const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedRecipe);
    }catch(err){
        res.status(400).json({ message: "Error fetching request", error: err.message });
    }
});

//Delete by Id
router.delete('/:id', authMiddleware, async (req, res) => {
    try{
        await Recipe.findByIdAndDelete(req.params.id);
        res.json({ message: 'Recipe deleted!' })
    }catch(err){
        res.status(400).json({ message: "Error fetching request", error: err.message });
    }
});

module.exports = router;
