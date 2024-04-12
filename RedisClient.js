const {createClient} = require('redis');


const client = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_ENDPOINT,
        port: 19910
    }
});

module.exports = client;