const socketio = require('socket.io');
const parseStringAsArray = require('./utils/parseStringAsArray');
const calculateDistance = require('./utils/calculateDistance');

let io;
const connections = [];
// Todo: save this on a DB (redis or mongo)

exports.setupWebSocket = (server) => {
    io = socketio(server);

    io.on('connection', socket => {
        // Ouve as conexões e, quando há uma conexão HTTP, pega o socket dela
        console.log(socket.id);
        console.log('AQUI');
        console.log(socket.handshake.query);
        const { latitude, longitude, techs } = socket.handshake.query;

        connections.push({
            id: socket.id,
            coordinates: {
                latitude: Number(latitude),
                longitude: Number(longitude),
            },
            techs: parseStringAsArray(techs),
        });
    });
};

exports.findConnections = (coordinates, techs) => {
    return connections.filter(connection => {
        // Testa se as coordenadas atual estão há 10km do dev criado e se alguma
        // tecnologia deste está na busca
        return calculateDistance(coordinates, connection.coordinates) < 10
            && connection.techs.some(item => techs.includes(item))
    })
}

exports.sendMessage = (to, message, data) => {
    to.forEach(connection => {
        io.to(connection.id).emit(message, data);
    })
}
