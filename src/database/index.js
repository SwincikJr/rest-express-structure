const { Sequelize, DataTypes } = require('sequelize')
const fs = require('fs')
const path = require('path')

module.exports = (databaseConfig, modelsDir, repositoriesDir) => {

    const sequelize = new Sequelize(databaseConfig)

    const db = {
        Sequelize,
        sequelize,
        models: {},
    }
    
    fs.readdirSync(modelsDir)
        .forEach(file => {
            const model = require(path.join(modelsDir, file))(sequelize, DataTypes)
            db.models[model.name] = model
        })

    Object.keys(db.models).forEach(modelName => {
        
        if (db.models[modelName].associate) {
            db.models[modelName].associate(db.models)
        }
    })

    fs.readdirSync(repositoriesDir)
        .forEach(file => {
            const { modelName, repository } = require(path.join(repositoriesDir, file))(db)
            db.models[modelName].repository = repository
        })

    return db
}