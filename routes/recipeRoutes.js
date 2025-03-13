const express = require('express');
const Recipe = require('../models/recipe');
const authMiddleware = require('../middleware/authMiddleware');
const { initializeApp } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');
const { credential } = require('firebase-admin');
const serviceAccount = require('../potater-recipe-firebase-adminsdk-fbsvc-d386f762cd.json');
const multer = require('multer');

const router = express.Router();

//Initializing Firebase Admin
const adminApp = initializeApp({
    credential: credential.cert(serviceAccount),
    storageBucket: 'potater-recipe.firebasestorage.app' // Firebase Bucket
});
//Initializing Storage and Bucket
const storage = getStorage(adminApp);
const bucket = storage.bucket();

const upload = multer({ storage: multer.memoryStorage() });

// Get all recipes
router.get('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const recipes = await Recipe.find({ createdBy: userId }).populate('createdBy', 'username');
        res.json(recipes);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch recipes", error: err.message });
    }
});

// Create a Recipe with IMG upload
router.post('/', authMiddleware, upload.single('image'), async (req, res) => {
    try {

        const { title, instructions, ingredients } = req.body;
        let imageUrl = null;
        let imagePath = null;

        if(req.file){
            const file = req.file;
            const fileName = `recipe-images/${Date.now()}-${file.originalname}`;
            const storageRef = storage.bucket().file(fileName);
            await storageRef.save(file.buffer);

            const signedUrls = await storageRef.getSignedUrl({ action: 'read', expires: '04-27-2100' });
            imageUrl = signedUrls[0];
            imagePath = fileName; //Store path for DELETE/PUT
        }

        const parsedIngredients = JSON.parse(ingredients);
        const parsedInstructions = JSON.parse(instructions);

        const newRecipe = new Recipe({
            title,
            instructions: parsedInstructions,
            ingredients: parsedIngredients,
            imageUrl,
            imagePath,
            createdBy: req.user.id,
        });
        
        await newRecipe.save();
        res.status(201).json(newRecipe);
    } catch (err) {
        console.error('Error creating recipe: ', err);
        res.status(400).json({ message: err.message });
    }
});

// Get recipe by ID
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }
        res.json(recipe);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching recipe', error: err.message });
    }
});

// Update Recipe by ID
router.put('/:id', authMiddleware,upload.single('image'), async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }
        if (recipe.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to update this recipe" });
        }
        const { title, instructions, ingredients, removeImage } = req.body;
        let imageUrl = recipe.imageUrl;
        let imagePath = recipe.imagePath;

        if(req.file){
            if(recipe.imagePath) await storage.bucket().file(recipe.imagePath).delete().catch(console.error);
            const fileName = `recipe-images/${Date.now()}-${req.file.originalname}`;
            const storageRef = storage.bucket().file(fileName);
            await storageRef.save(req.file.buffer);
            const signedUrls = await storageRef.getSignedUrl({ action: 'read', expires: '04-27-2100' });
            imageUrl = signedUrls[0];
            imagePath = fileName;
        } else if(removeImage === 'true' && recipe.imagePath){
            await storage.bucket().file(recipe.imagePath).delete().catch(console.error);
            imageUrl = null;
            imagePath = null;
        }

        const updatedRecipe = await Recipe.findByIdAndUpdate(
            req.params.id, 
            {
                title,
                ingredients: JSON.parse(ingredients),
                instructions: JSON.parse(instructions),
                imageUrl,
                imagePath
            }, 
            { new: true, runValidators: true }
        );

        
        res.json(updatedRecipe);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete by ID
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }
        if (recipe.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to delete this recipe" });
        }

        //Deleting image from Firebase
        if(recipe.imagePath) {
            const file = bucket.file(recipe.imagePath); //Reference the Firebase file
            
            try {
                const [exists] = await file.exists(); //check if file exists
                if(exists){
                    await file.delete(); //Delete Firebase file
                    console.log(`Image deleted from Firebase storage: ${recipe.imagePath}`);
                } else {
                    console.log(`IMG not found in Firebase directory: ${recipe.imagePath}`);
                }
            } catch (error) {
                console.error('Error deleting from Firebase', error);
            }
        }
        
        await Recipe.findByIdAndDelete(req.params.id);//Deletes recipe in MongoDB

        res.json({ message: 'Recipe deleted!' });
    } catch (err) {
        res.status(400).json({ message: "Error deleting recipe", error: err.message });
    }
});

module.exports = router;