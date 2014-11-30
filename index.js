var MineBot = require('./src/MineBot'),
    bot,

    host = process.argv[3] || null,
    port = process.argv[2] || null;

bot = new MineBot(host, port);