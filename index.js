const { connectDB } = require('./config/server');
const { scrapPublicadas } = require('./scraps/publicadas');

connectDB();

scrapPublicadas({nextPage: -1});