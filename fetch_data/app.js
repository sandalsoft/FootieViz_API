var mongoose = require('mongoose');
var request = require('request');
var httpsync = require('httpsync');
var httpSync = require('http-sync');
var config = require('./config')
var fs = require('fs');
var fpl = require('./fpl');


var PLAYER_DATA_URL = 'http://fantasy.premierleague.com/web/api/elements/';
var FOOTIEVIZ_MONGO = 'mongodb://footiedb:FOOTIEd33b33@ds053438.mongolab.com:53438/fantasiefootie';
// var MAX_PLAYERS = config.maxPlayers;

mongoose.connect(FOOTIEVIZ_MONGO);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {});



var playerSchema = mongoose.Schema({
    // _id: Number,
    player_id: Number,
    photo: String,
    fixture_history: mongoose.Schema.Types.Mixed,
    fixtures: mongoose.Schema.Types.Mixed,
    season_history: Array,
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
}, {
    collection: 'Player'
});

var Player = mongoose.model('Player', playerSchema);
var MAX_PLAYERS = 0;
fpl.dropPlayerRecords(function(statusCode) {
    if (statusCode !== 200) {
        console.log('Error dropping records!');
        process.kill();
    }
    else {
        console.log('Database cleaned!');
    }
});

fpl.getMaxPlayerId(function(id) {
    console.log('MAX_PLAYERS: ' + id);
    MAX_PLAYERS = 5; //id
});



for (var i = MAX_PLAYERS - 1; i >= 1; i--) {
    (function(i) { //  This is needed to keep i in scope. See http://blog.mixu.net/2011/02/03/javascript-node-js-and-for-loops/

        var player_id = i;
        var playerUrl = PLAYER_DATA_URL + player_id + '/';
        // console.log('befor req getting: ' + player_id);

        request(playerUrl, function(error, response, body) {
            // console.log('IN for req getting: ' + player_id);
            if (!error && response.statusCode == 200) {
                // process.kill();
                var playerJson = JSON.parse(body);
                var Player = mongoose.model('Player', playerSchema);
                var player = new Player(playerJson);
                player.fixtures.summary = playerJson.fixtures.summary;
                player.fixtures.all = playerJson.fixtures.all;
                player.fixture_history.summary = playerJson.fixture_history.summary;
                player.fixture_history.all = playerJson.fixture_history.all;
                // player.markModified('fixtures');
                // player.markModified('fixture_history');
                // player.player_id = player_id;
                player.player_id = player_id;
                var query = {
                    player_id: player.player_id
                };

                player.save(function(err) {
                    if (err) {
                        console.log('Error saving: ' + player.player_id + '-' + player.web_name);
                    } else {
                        console.log('Saved: ' + player.player_id + '-' + player.web_name);
                    }
                });
                // Player.findOneAndUpdate(query, player, {upsert: true}, function(err, doc) {
                //     if (err) {
                //         console.log('ERROR SAVING : ' + player.player_id);
                //         console.log('err: ' + err);
                //     }
                //     else {
                //     console.log('Saved: ' + doc.web_name);
                //     }
                // });


                console.log('GOT : ' + player.player_id + '-' + player.web_name);
            }
        }); //request
    })(i);
} //for loop
