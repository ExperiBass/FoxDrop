const fs = require('fs')
const Evilscan = require('evilscan')
const axios = require('axios')
const FormData = require('form-data')
const {
    name
} = require('../../package.json')

module.exports = {
    async scanForOtherClients() {
        let clients = []

        const options = {
            target: '192.168.1.1-255',
            port: '621',
            status: 'O', // Open
            banner: true,
            concurrency: 700
        }
        new Evilscan(options, (err, scan) => {

            if (err) {
                console.log(err)
                return
            }

            scan.on('result', data => {
                // fired when item is matching options
                axios.get(`https://${data.ip}:${data.port}/info`).then(res => {
                    res = JSON.parse(res)
                    if (res.name && res.name === name) {
                        clients.push(data)
                    }
                }).catch(e => {
                    // do nothing, not a fellow client
                })
            })

            scan.on('error', err => {
                throw err
            });

            scan.on('done', () => {
                // finished !
                return clients
            })

            scan.run()
        })
    },
    receiveFile(fileName, buffer) {
        try {
            const file = fs.openSync(`~/Downloads/${fileName}`, 'w+')
            fs.writeSync(file, buffer)
        } catch (e) {
            throw e
        }
    },
    async sendFile(target, pathToFile) {
        try {
            const fileBuffer = await Buffer.from(fs.readFileSync(`${pathToFile}`))
            let formData = new FormData()
            formData.append('file', fileBuffer)
            await axios.post(`https://${target.ip}:${target.port}`, formData)
        } catch(e) {
            throw e
        }
    }
}