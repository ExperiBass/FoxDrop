const Express = require("express")
const app = Express()
const os = require('os')
const {version, name} = require('../../package.json')

function start() {
    app.use(Express.json())
    app.get("/", (req, res) => {
        res.send("Hi!")
    })
    app.post("/", (req, res) => {
        console.log(req.body, req.headers)
        res.send("Thanks!")
    })
    app.get("/info", (req, res) => {
        let response = {
            version,
            name,
            hostname: os.hostname()
        }
        res.send(`${JSON.stringify(response)}`)
    })
    app.listen(621, () => {
        console.log("Server has started, and is running on localhost:621")
    })
}
start()