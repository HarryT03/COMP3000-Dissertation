require('../models/database');
const { match } = require('assert');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');

/**
 * GET /
 * Homepage
 */
exports.homepage = async(req, res) => {

try {

    const limitNumber = 5;
    const categories = await Category.find({}).limit(limitNumber);
    const latest = await Recipe.find({}).sort({_id: -1}).limit(limitNumber);
    const thai = await Recipe.find({category: "Thai"}).limit(limitNumber);
    const american = await Recipe.find({category: "American"}).limit(limitNumber);
    const chinese = await Recipe.find({category: "Chinese"}).limit(limitNumber);

    const food = { latest, thai, american, chinese};

    res.render('index', { title: 'Homepage', categories, food });
}
catch (error) {
    res.status(500).send({message: error.message || "Error occurred while retrieving categories" });
}
}
/**
 * GET /categories
 * Categories
 */
exports.exploreCategories = async(req, res) => {
    try {
        const limitNumber = 20;
        const categories = await Category.find({}).limit(limitNumber);
        res.render('categories', { title: 'Categories', categories });
    }
    catch (error) {
        res.status(500).send({message: error.message || "Error occurred while retrieving categories" });
    }
}

/**
 * GET /categories/:id
 * Categories By Id
 */
exports.exploreCategoriesById = async(req, res) => {
    try {
        let categoryId = req.params.id;
        const limitNumber = 20;
        const categoriesById = await Recipe.find({ 'category': categoryId}).limit(limitNumber);
        res.render('categories', { title: 'Categories', categoriesById });
    }
    catch (error) {
        res.status(500).send({message: error.message || "Error occurred while retrieving categories" });
    }
}

/**
 * GET /recipe/:id
 * Recipes
 */
exports.exploreRecipe = async(req, res) => {
    try {
        let recipeId = req.params.id;

        const recipe = await Recipe.findById(recipeId);


        res.render('recipe', { title: 'Recipes', recipe});
    }
    catch (error) {
        res.status(500).send({message: error.message || "Error occurred while retrieving recipes" });
    }
}


/**
 * POST /search
 * Search
 */
exports.searchRecipe = async(req, res) => {
    try {
        let searchTerm = req.body.searchTerm;
        let recipe = await Recipe.find({ $text: { $search: searchTerm, $diacriticSensitive: true } });
        res.render('search', { title: 'Search', recipe});
    } catch (error) {
        res.status(500).send({message: error.message || "Error occurred while searching recipes" });
    }

    
}
    
/**
 * GET /explore-latest
 * Explore Latest
 */
exports.exploreLatestRecipe = async(req, res) => {
    try {
        const limitNumber = 20;
        const recipe = await Recipe.find({}).sort({_id: -1}).limit(limitNumber);

        res.render('explore-latest', { title: 'Explore Latest', recipe});
    }
    catch (error) {
        res.status(500).send({message: error.message || "Error occurred while retrieving recipes" });
    }
}


/**
 * GET /explore-random
 * Explore Random
 */
exports.exploreRandomRecipe = async(req, res) => {
    try {
       
        let count = await Recipe.find().countDocuments();
        let random = Math.floor(Math.random() * count);
        let recipe = await Recipe.findOne().skip(random).exec();

        res.render('explore-random', { title: 'Explore Random', recipe});
    }
    catch (error) {
        res.status(500).send({message: error.message || "Error occurred while retrieving recipes" });
    }
}


/**
 * GET /submit-recipe
 * Submit Recipe
 */
exports.submitRecipe = async(req, res) => {
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');

    res.render('submit-recipe', { title: 'Submit Recipe', infoErrorsObj, infoSubmitObj} );
}

/**
 * POST /submit-recipe
 * Submit Recipe
 */
exports.submitRecipePost = async(req, res) => {

    try {

        let imageUploadFile;
        let uploadPath;
        let newImageName;

        if (!req.files || Object.keys(req.files).length === 0) {
            req.flash('infoErrors', { message: 'No files were uploaded'});
            console.log("No files were uploaded");
        }
        else {
            imageUploadFile = req.files.image;
            newImageName = Date.now() + imageUploadFile.name;

            uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

            imageUploadFile.mv(uploadPath, function(err) {
                if (err) return res.status(500).send(err);
            });
        }

      

        const newRecipe = new Recipe({
            name: req.body.name,
            description: req.body.description,
            creator: req.body.creator,
            ingredients: req.body.ingredients,
            category: req.body.category,
            image: newImageName
        });

        await newRecipe.save();

        req.flash('infoSubmit', 'Your recipe has been submitted successfully!')
        res.redirect('/submit-recipe');
    } catch (error) {
        req.flash('infoErrors', error);
        res.redirect('/submit-recipe');
    }

    
}


/**
 * POST /recipe-by-ingredient
 * Search
 */

exports.getRecipeByIngredient = async(req, res) => {
    const infoErrorsObj = req.flash('infoErrors');
    const infoSubmitObj = req.flash('infoSubmit');
    const recipes = await Recipe.find();
    res.render('recipe-by-ingredient', { title: 'Search Recipe By Ingredient', infoErrorsObj, infoSubmitObj , recipes });
}

exports.postRecipeByIngredient = async(req, res) => {
    try {
        

        const recipes = await Recipe.find();
        const ingredients = recipes.map(recipe => recipe.ingredients).flat();
        const userIngredients = req.body.ingredients.split(",").map(ingredient => ingredient.trim());
        
        

        if (!ingredients) {
            req.flash('infoErrors', 'No Ingredients Entered!');
             return res.redirect('/');
        }

        const matchingRecipes = recipes.filter(recipe => 
            recipe.ingredients.some(ingredient => 
                userIngredients.some(userIngredient => 
                    ingredient.toLowerCase().includes(userIngredient.toLowerCase())
                )
            )
        );

        console.log('User Ingredients:', userIngredients);
        console.log('Matching Recipes:', matchingRecipes);

        const infoErrorsObj = req.flash('infoErrors');
        const infoSubmitObj = req.flash('infoSubmit');
        res.render('recipe-by-ingredient', { title: 'Search Recipe By Ingredient', infoErrorsObj, infoSubmitObj, recipes: matchingRecipes});
    } catch (error) {
        res.status(500).send({message: error.message || "Error occurred while searching recipes" });
    }

}

exports.about = async(req, res) => {
    res.render('about', { title: 'About' });
}

exports.contact = async(req, res) => {
    res.render('contact', { title: 'Contact' });
}


// update a recipe - hardcoded to prevent accidental/unpermitted updating
async function updateRecipe(){
try {
    const res = await Recipe.updateOne({name: ""}, { name: ""});
    res.n;
    res.nModified;
} catch (error) {
    console.log("Error updating recipe: " + error);
}
}

// delete a recipe - hardcoded to prevent accidental/unpermitted deletion
async function deleteRecipe(){
    try {
        await Recipe.deleteOne({name: ""});
    } catch (error) {
        console.log("Error deleting recipe: " + error);
    }
}

// updateRecipe();
 // deleteRecipe();