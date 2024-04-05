const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');

/**
 * App Routes
 */
router.get('/', recipeController.homepage);
router.get('/categories', recipeController.exploreCategories);
router.get('/categories/:id', recipeController.exploreCategoriesById);
router.get('/recipe/:id', recipeController.exploreRecipe);
router.post('/search', recipeController.searchRecipe);
router.get('/explore-latest', recipeController.exploreLatestRecipe);
router.get('/explore-random', recipeController.exploreRandomRecipe);
router.get('/submit-recipe', recipeController.submitRecipe);
router.post('/submit-recipe', recipeController.submitRecipePost);
router.get('/recipe-by-ingredient', recipeController.getRecipeByIngredient);
router.post('/recipe-by-ingredient', recipeController.postRecipeByIngredient);


module.exports = router;