const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websocket');

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
            
            let { login, name, avatar_url, bio } = apiResponse.data;
            if (! name) {
                name = login
            }
        
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

            // Filtrar as conexões que estão há no máxumo 10km de distância e
            // que o novo dev possua pelo menos uma das tecnologias buscadas

            const sendSocketMessageTo = findConnections(
                { latitude, longitude },
                techsArray,
            );

            sendMessage(sendSocketMessageTo, 'new-dev', dev);
            
            return response.json(dev);
        }
        return response.json({'error': 'Dev já cadastrado!'});
    },

    async update() {
        // TODO: Extra, não será utilizado durante a semana
    },

    async destroy() {
        // TODO: Extra, não será utilizado durante a semana
    },
};