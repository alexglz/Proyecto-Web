const Recipe = require('../models/recipe')_

const getRecipes = function(req,res){
	Recipe.find({}).then(function(recipes){
		res.send(recipes);
	}).catch(function(error){
		res.status(500).send(error);
	});
}

const getUserRecipes = function(req,res){
	Recipe.find({createdBy: req.user._id}).then(function(recipes){
		res.send(recipes);
	}).catch(function(error){
		res.status(500).send(error);
	})
}

const createRecipe = function(req,res){
	const recipe = new Recipe({
		...req.body,
		createdBy: req.user._id
	})
	recipe.save().then(function(){
		return res.send(recipe);
	}).catch(function(error){
		return res.status(400).send(error)
	});
}

const updateRecipe = function(req,res){
	const _id = req.params.id
  	const updates = Object.keys(req.body)
  	const allowedUpdates = ['description', 'completed']
  	//Determinar qué campos se pueden editar
  	const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));

  	if( !isValidUpdate ) {
    return res.status(400).send({
      error: 'Invalid update, only allowed to update: ' + allowedUpdates
    })
  }

  //El update a una receta solo se permite si el usuario es dueño de la receta
  Recipe.findOneAndUpdate({ _id, createdBy: req.user._id }, req.body ).then(function(recipe) {
    if (!recipe) {
      return res.status(404).send({ error: `Task with id ${_id} not found.`})
    }
    return res.send(recipe)
  }).catch(function(error) {
    res.status(500).send({ error: error })
  })
}

const deleteRecipe = function(req, res) {
  const _id = req.params.id
  //Solamente válido el delete para el usuario que la creó
  Recipe.findOneAndDelete({ _id, createdBy: req.user._id }).then(function(recipe){
    if(!recipe) {
      return res.status(404).send({ error: `Task with id ${_id} not found.`})
    }
    return res.send(recipe)
  }).catch(function(error) {
    res.status(505).send({ error: error })
  })
}