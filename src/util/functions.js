const fs = require('fs')
const Evilscan = require('evilscan')
const axios = require('axios')
const FormData = require('form-data')
const {
    name
} = require('../../package.json')

module.exports = {
    async scanForOtherClients() {

        // TODO: Find async port scanner
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
    /**
     * Send file to other client.
     * @param {object} target target object, includes IP and port
     * @param {string} target.ip IP address of target
     * @param {string|number} target.port Port to send data to
     * @param {string} pathToFile Path to file to transfer
     * @param {object} fileInfo information of file to transfer
     * @param {string} fileInfo.name Name+extension of transferred file (for example, FOOBAR.MD)
     */
    async sendFile(target, pathToFile, fileInfo) {
        try {
            const fileBuffer = Buffer.from(fs.readFileSync(`${pathToFile}`))
            let formData = new FormData()
            formData.append('file', fileBuffer)
            formData.append('fileInfo', fileInfo)
            await axios.post(`https://${target.ip}:${target.port}`, formData)
        } catch (e) {
            throw e
        }
    }
}