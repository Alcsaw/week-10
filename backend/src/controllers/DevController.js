const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {
    async index(request, response) {
        const devs = await Dev.find();
        return response.json(devs);
    },

    async store(request, response) {
    
        const { github_username, techs, latitude, longitude } = request.body;

        let dev = await Dev.findOne( { github_username });

        if (! dev) {
            const apiResponse = await axios.get(`https://api.github.com/users/${github_username}`);
            // se não existir a variável name, no momento da desestruturação, ela recebe
            // o valor de login, que é campo obrigatório no Github e com certeza existirá
            const { name = login, avatar_url, bio } = apiResponse.data;
        
            const techsArray = parseStringAsArray(techs);
        
            const location = {
                type: 'Point',
                coordinates: [longitude, latitude],
            };
        
            dev = await Dev.create({
                github_username,
                name,
                avatar_url,
                bio,
                techs: techsArray,
                location,
            });
        }
    
        return response.json(dev);
    },

    async update() {
        // TODO: Extra, não será utilizado durante a semana
    },

    async destroy() {
        // TODO: Extra, não será utilizado durante a semana
    },
};