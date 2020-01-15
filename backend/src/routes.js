const { Router } = require('express');
const DevController = require('./controllers/DevController');
const SearchController = require('./controllers/SearchController');

const routes = Router();
/*
Tipos de parâmetros:
    Query Params: request.query (Visualizações: Filtros, ordenação, paginação...)
    Route Params: request.params (Idenificar um recurso na alteração ou remoção)
    Body: request.body (Dados para criação ou alterçaão de um registro)
*/

routes.get('/devs', DevController.index);
routes.post('/devs', DevController.store);

routes.get('/search', SearchController.index);

module.exports = routes;