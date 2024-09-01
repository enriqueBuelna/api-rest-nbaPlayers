const mongoose = require('mongoose');

const nbaPlayerSchema = new mongoose.Schema({
    name:String,
    team: String,
    nationalTeam: String
})

module.exports = mongoose.model('nbaPlayers', nbaPlayerSchema)