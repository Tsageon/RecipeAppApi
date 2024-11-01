const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController.js');

router.post('/recipes', recipeController.createRecipe);
router.get('/recipes', recipeController.getRecipes);
router.get('/recipes/:id', recipeController.getRecipeById);
router.put('/recipes/:id', recipeController.updateRecipe);
router.delete('/recipes/:id', recipeController.deleteRecipe);

module.exports = router;
