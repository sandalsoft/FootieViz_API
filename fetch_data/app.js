var request = require('requests');
var mongoose = require('mongoose');
var httpsync = require('httpsync');
var config = require('./config')

var http = require('http');
var fs = require('fs');
// var sleep = require('sleep');

var PLAYER_DATA_URL = 'http://fantasy.premierleague.com/web/api/elements/';
var FOOTIEVIZ_MONGO = 'mongodb://footiedb:FOOTIEd33b33@ds053438.mongolab.com:53438/fantasiefootie'
var MAX_PLAYERS = config.maxPlayers;

mongoose.connect(FOOTIEVIZ_MONGO);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {});

var playerSchema = mongoose.Schema({
    photo: String,
    fixture_history: Array,
    season_history: Array,
    fixtures: Array,
    event_total: Number,
    type_name: String,
    team_name: String,
    selected_by: Number,
    total_points: Number,
    current_fixture: String,
    next_fixture: String,
    team_code: Number,
    team_id: Number,
    status: String,
    code: Number,
    first_name: String,
    second_name: String,
    web_name: String,
    now_cost: Number,
    chance_of_playing_this_round: String,
    chance_of_playing_next_round: String,
    value_form: Number,
    value_season: Number,
    cost_change_start: Number,
    cost_change_event: Number,
    cost_change_start_fall: Number,
    cost_change_event_fall: Number,
    in_dreamteam: Boolean,
    dreamteam_count: Number,
    selected_by_percent: Number,
    form: Number,
    transfers_out: Number,
    transfers_in: Number,
    transfers_out_event: Number,
    transfers_in_event: Number,
    event_points: Number,
    points_per_game: Number,
    ep_this: Number,
    ep_next: Number,
    special: Boolean,
    minutes: Number,
    goals_scored: Number,
    assists: Number,
    clean_sheets: Number,
    goals_conceded: Number,
    own_goals: Number,
    penalties_saved: Number,
    penalties_missed: Number,
    yellow_cards: Number,
    red_cards: Number,
    saves: Number,
    bonus: Number,
    ea_index: Number,
    bps: Number,
    element_type: Number,
    team: Number,
    current_fixture_is_home: Boolean,
    current_fixture_team_id: Number,
    created_at: Date
});

var Player = mongoose.model('Player', playerSchema);

maxPlayerId = MAX_PLAYERS;

// var playerExists = true;
// do {
//     maxPlayerUrl = PLAYER_DATA_URL + maxPlayerId + '/';
//     console.log('getting : ' + maxPlayerUrl );
//     var req = httpsync.get({ url : maxPlayerUrl});
//     var res = req.end();
//     if (res.statusCode === 404) {
//       playerExists = false;
//       MAX_PLAYERS = maxPlayerId - 1;
//       break;
//     }
//     maxPlayerId++;
//     sleep.sleep(1);
// } while (playerExists);

console.log('MAX_PLAYERS: ' + MAX_PLAYERS);


function sleep(callback) {
    var now = new Date().getTime();
    while (new Date().getTime() < now + 3000) {
        // do nothing
    }
    callback();
}


for (var i = MAX_PLAYERS; i >= 0; i--) {
    sleep(function() {

        var playerId = [i];
        var playerUrl = PLAYER_DATA_URL + playerId + '/';
        console.log('getting : ' + playerUrl);

        http.get(playerUrl, function(res) {
            var body = '';
            res.on('data', function(chunk) {
                body += chunk;
                console.log(body);
            });
            res.on('end', function() {
                console.log(body);
            });
        }).on('error', function(e) {
            console.log("Got error: " + e.message);
        });

    });
}



var saveMaxPlayer = function(id) {
    var content = 'var config = {}\n' +
        'config.maxPlayers = ' +
        id + '\n' +
        'module.exports = config;';


    fs.writeFileSync(file, content, 'utf8');
}
