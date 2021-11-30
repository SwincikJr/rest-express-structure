const fs = require('fs')
const path = require('path')

module.exports = (app, db, controllersDir, authHandler) => {
    fs.readdirSync(controllersDir)
        .forEach(model => {
            fs.readdirSync(path.join(controllersDir, model))
                .forEach(controller => {

                    const { endpoint, method, middlewares, handler, authenticate } = require(path.join(controllersDir, model, controller))

                    let steps = []

                    if (authHandler && authenticate) steps.push(authHandler(db))

                    steps = steps.concat(middlewares.map(middlweare => middlweare(db))).concat(handler(db))

                    app[method](`/api/${model}${endpoint}`, ...steps)
                })
        })
}