const express = require('express')
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

module.exports = ({
    modelsDir,
    repositoriesDir,
    databaseConfig,
    controllersDir,
    authHandler
}) => {
    try {
        const db = require('./src/database')(databaseConfig, modelsDir, repositoriesDir)
        require('./src/controllers')(app, db, controllersDir, authHandler)
        return app
    } catch (error) {
        console.error(error)
        throw new Error('Error on generate server')
    }
}
