require('../models/database');
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

        if (req.files || Object.keys(req.files).length === 0) {
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
        req.flash('infoErrors', error.message || "Error occurred while submitting recipe");
        res.redirect('/submit-recipe');
    }

    
}

async function updateRecipe(){
try {
    const res = await Recipe.updateOne({name: ""}, { name: ""});
    res.n;
    res.nModified;
} catch (error) {
    console.log("Error updating recipe: " + error);
}
}

async function deleteRecipe(){
    try {
        await Recipe.deleteOne({name: ""});
    } catch (error) {
        console.log("Error deleting recipe: " + error);
    }
}

// async function insertDummyCategoryData() {
//     try {
//         await Category.insertMany([
//                    {
//                     "name": "Thai",
//                     "image": "thai-food.jpg"
//                   },
//                   {
//                     "name": "American",
//                     "image": "american-food.jpg"
//                   }, 
//                   {
//                     "name": "Chinese",
//                     "image": "chinese-food.jpg"
//                   },
//                   {
//                     "name": "Mexican",
//                     "image": "mexican-food.jpg"
//                   }, 
//                   {
//                     "name": "Indian",
//                     "image": "indian-food.jpg"
//                   },
//                   {
//                     "name": "Spanish",
//                     "image": "spanish-food.jpg"
//                   }
//                 ]);
//     }
//     catch (error) {
//         console.log("Error inserting dummy data: " + error);
//     }
// }
// insertDummyCategoryData();

// async function insertDummyRecipeData() {
//     try {
//         await Recipe.insertMany([
//                      {
//                       "name": "Pad Thai",
//                       "description": "Pad Thai is a stir-fried rice noodle dish commonly served as a street food and at most restaurants in Thailand as part of the country's cuisine. It is typically made with rice noodles, chicken, beef or tofu, peanuts, a scrambled egg, and bean sprouts, among other vegetables.",
//                       "creator": "John Doe",
//                       "ingredients": ["Rice noodles", "Beef", "Peanuts", "Egg", "Bean sprouts"],
//                       "category": "Thai",
//                       "image": "pad-thai.jpg"
//                     },
//                     {
//                       "name": "Hamburger",
//                       "description": "A hamburger is a sandwich consisting of one or more cooked patties of ground meat, usually beef, placed inside a sliced bread roll or bun. The patty may be pan fried, grilled, smoked or flame broiled.",
//                       "creator": "John Doe",
//                       "ingredients": ["Beef", "Bread roll", "Lettuce", "Tomato", "Onion"],
//                       "category": "American",
//                       "image": "hamburger.jpg"
//                     }, 
//                     {
//                       "name": "Kung Pao Chicken",
//                       "description": "Kung Pao chicken, also transcribed as Gong Bao or Kung Po, is a spicy, stir-fried Chinese dish made with cubes of chicken, peanuts, vegetables, and chili peppers. The classic dish in Sichuan cuisine originated in the Sichuan Province of south-western China and includes Sichuan peppercorns.",
//                         "creator": "John Doe",
//                         "ingredients": ["Chicken", "Peanuts", "Vegetables", "Chili peppers", "Sichuan peppercorns"],
//                         "category": "Chinese",
//                         "image": "kung-pao-chicken.jpg"
//                     },
//                 ]);
//     }
//     catch (error) {
//         console.log("Error inserting dummy data: " + error);
//     }
// }
// insertDummyRecipeData();