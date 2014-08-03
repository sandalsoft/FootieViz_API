var mongoose = require('mongoose');
var httpsync = require('httpsync');
var config = require('./config')
var fs = require('fs');


var PLAYER_DATA_URL = 'http://fantasy.premierleague.com/web/api/elements/';
var FOOTIEVIZ_MONGO = 'mongodb://footiedb:FOOTIEd33b33@ds053438.mongolab.com:53438/fantasiefootie';
var MAX_PLAYERS = config.maxPlayers;

mongoose.connect(FOOTIEVIZ_MONGO);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback() {});

var playerSchema = mongoose.Schema({
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
});

var Player = mongoose.model('Player', playerSchema);

maxPlayerId = MAX_PLAYERS;


console.log('MAX_PLAYERS: ' + MAX_PLAYERS);
var numPlayers = MAX_PLAYERS;


for (var i = MAX_PLAYERS - 1; i >= 1; i--) {
  var id = i;
  var playerUrl = PLAYER_DATA_URL + id + '/';
  // console.log('getting: ' + playerUrl);
  var req = httpsync.get({ url : playerUrl});
  var res = req.end();
  if (res.statusCode === 200) {
    var playerJson = JSON.parse(res.data);
    var Player = mongoose.model('Player', playerSchema);

    var player = new Player(playerJson);

    // var history = [];
    // history = playerJson.season_history;
    // console.log('playerJson.season_history: ' + JSON.stringify(playerJson.season_history));
    // for (var i = history.length - 1; i >= 0; i--) {
    //   var season = {};
    //   var season_data = history[i];
    //   season.year = season_data[0];
    //   season.minutes_played = season_data[1];
    //   season.goals_scored = season_data[2];
    //   season.assists = season_data[3];
    //   season.clean_sheets = season_data[4];
    //   season.goals_conceded = season_data[5];
    //   season.own_goals = season_data[6];
    //   season.penalties_saved = season_data[7];
    //   season.penalties_missed = season_data[8]
    //   season.yellow_cards = season_data[9];
    //   season.red_cards = season_data[10];
    //   season.saves = season_data[11];
    //   season.bonus = season_data[12];
    //   season.ea_sports_ppi = season_data[13];
    //   season.net_transfers = season_data[14];
    //   season.value = season_data[15];
    //   season.points = season_data[16];

    //   player.season_history.push(season);
    // }

    player.fixtures.summary = playerJson.fixtures.summary;
    player.fixtures.all = playerJson.fixtures.all;
    player.fixture_history.summary = playerJson.fixture_history.summary;
    player.fixture_history.all = playerJson.fixture_history.all;
    player.markModified('fixtures');
    player.markModified('fixture_history');
    player.player_id = id;

    // console.log('player: ' + player);
    player.save();
    console.log('DONE : ' + id + '-' + player.web_name);
  }
};



var saveMaxPlayer = function(id) {
    var content = 'var config = {}\n' +
        'config.maxPlayers = ' +
        id + '\n' +
        'module.exports = config;';


    fs.writeFileSync(file, content, 'utf8');
}
