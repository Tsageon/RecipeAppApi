const Recipe = require('../models/recipes');
const Joi = require('joi')

const recipeValidation = Joi.object({
  title: Joi.string().min(3).max(255).required(),
  ingredients: Joi.array().items(Joi.string().required()).min(1).required(),
  instructions: Joi.string().min(10).required(),
  category: Joi.string().valid('Appetizer', 'Main Course', 'Dessert').required(),
  cookingTime: Joi.number().min(1).required()
});


exports.createRecipe = async (req, res) => {
  const { error } = recipeValidation.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  try {
    const recipe = new Recipe(req.body);
    await recipe.save();
    res.status(201).json(recipe);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create recipe. Please try again later.' });
  }
};


exports.getRecipes = async (req, res) => {
  const { page = 1, pageSize = 10 } = req.query;
  const skip = (page - 1) * pageSize;
  
  try {
    const recipes = await Recipe.find().skip(skip).limit(Number(pageSize));
    const totalItems = await Recipe.countDocuments();
    res.json({
      totalItems,
      currentPage: page,
      totalPages: Math.ceil(totalItems / pageSize),
      recipes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json(recipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};