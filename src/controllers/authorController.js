const authorModel = require("../models/authorModel")


const createAuthor = async function (req, res) {
   
    try{
    let data = req.body  //take the data from the request body

    // Create a new document in Author model
    let savedData = await authorModel.create(data)
    res.status(201).send({status:true, data: savedData, message: 'Registerd Successfull'})
    }
    
    catch(err){
        res.status(500).send({message:"Serverside Errors. Please try again later", error: err.message})

    }
}

module.exports.createAuthor = createAuthor