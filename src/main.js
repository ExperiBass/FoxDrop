const axios = require('axios')
const portchecker = require('portchecker')
const dns = require('dns')

module.exports = {
    async findOtherClients() {
        ret(p) {

        }
        const DNS = dns.getServers()
        const openPorts = portchecker.getAllOpen(1, 25565, DNS[0], ret)
        let otherClients = []
        /*for (port in openPorts) {
            const info = axios.get(`${host}:${port}`)
            if (info.client.startsWith('FoxDrop')) {
                otherClients.push(port)
            }
        }*/
        return
    }
}