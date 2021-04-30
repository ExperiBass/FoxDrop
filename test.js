const Evilscan = require('evilscan')
const axios = require('axios')
const os = require('os')

const {
    name
} = require('./package.json')


const options = {
    target: '192.168.1.1-255',
    port: '621',
    status: 'O', // Open
    banner: true,
    concurrency: 700
}
new Evilscan(options, (err, scan) => {
    let clients = []

    if (err) {
        console.log(err)
        return
    }

    scan.on('result', async data => {
        // fired when item is matching options
        try {
            const response = await axios.get(`http://${data.ip}:${data.port}/info`)
            let res = response.data
            if (res.name && res.name === name && res.hostname !== os.hostname()) {
                clients.push(data)
            }
        } catch (e) {

        }
    })

    scan.on('error', err => {
        throw err
    })

    scan.on('done', () => {
        // finished !
        console.log(clients)
    })

    scan.run()
})

//evilscan.run()
/*const {scanForOtherClients} = require('./src/util/functions')
scanForOtherClients().then(console.log)*/