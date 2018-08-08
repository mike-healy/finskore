
// Finskore App
const finskore = new Vue({
    el: '#app',

    data: {
        title: 'Finskore',
        theme: 'default',

        //Config
        playToScore: 50,
        players: [],

        //State
        scoringIndex: null,
        scoringNow: {}, //instance of current player being scored
        whoseTurn:  0,   //index

        gameInProgress: false,
        setupGame: false,
        showScoreModal: false,
        newPlayer: '',
        winner: ''
    },
    
    methods: {
        createNewGame() {
            this.setupGame = true;

            setTimeout(function() {
                document.getElementById('newPlayer').focus();
            }, 40);
        },

        startGame() {
            this.setupGame = false;
        },

        addPlayer() {
            if(this.newPlayer === '') {
                return;
            }

            this.players.push({
                name: this.newPlayer,
                score: 0,
                turns: [], //history of scores
                strikes: 0,
                position: 1  //everyone's a winner, until they're not
            });

            this.newPlayer = '';
            document.getElementById('newPlayer').focus();
        },

        deletePlayer() {
            if(this.scoringIndex === null) {
                return;
            }
            if(!confirm('Remove ' + this.scoringNow.name + ' from the game?')) {
                return;
            }

            this.players.splice(this.scoringIndex, 1);
            this.showScoreModal = false;
        },

        hasStruckOut(player) {
            return player.strikes >= 3;
        },

        showStrikes(player) {
            let str = '';
            if(player.strikes === 0) {
                return str;
            }

            for(let i=0; i<player.strikes; i++) {
                str += 'x ';
            }
            return str;
        },

        //@var index player index
        enterScoreForm(index) {

            //this.scoringNow.index = index;
            this.scoringIndex = index;
            this.scoringNow = this.players[index];

            this.showScoreModal = true;
            this.setupGame = false;
            
        },

        saveScore(event) {

            if(typeof event === 'undefined') {
                return;
            }

            //Not a button click
            if(typeof event.target.dataset.score === 'undefined') {
                return;
            }

            let score = parseInt(event.target.dataset.score);
            let index = this.players.indexOf(this.scoringNow);

            if(isNaN(score)) {
                score = 0;
            }
            
            this.gameInProgress = true;
            this.showScoreModal = false;

            //Swing and a miss
            if(score === 0) {
                this.scoringNow.strikes++;
            }

            this.scoringNow.turns.unshift(score);
            this.scoringNow.score += score;

            //OVER QUOTA -- Whoops
            if(this.scoringNow.score > this.playToScore) {
                this.scoringNow.score = this.resetTo;
                this.scoringNow.turns.unshift(':(');
                this.scoringNow.theyBlewIt = true;
            } else {
                this.scoringNow.theyBlewIt = false;
            }
            
            //Copy score for sorting
            this.updatePositions();

            //Reset strikes if they got a hit
            if(score > 0) {
                this.scoringNow.strikes = 0;
            }

            //Declare winner
            if(this.scoringNow.score === this.playToScore) {
                this.winner = this.scoringNow.name;
                return;
            }

            this.nextTurn();
        },

        // Update players position after each turn
        // bug: won't set a new leader if the current one strikes out
        updatePositions() {
            
            let scores = [];
            
            this.players.forEach( (player, index) => {
                scores.push({
                    index: index,
                    score: player.score,
                    struckout: this.hasStruckOut(player)
                });
            });

            scores.sort( function(a,b) {
                
                if( (!a.struckout && !b.struckout) ||
                    (a.struckout && b.struckout) ) {
                    
                    return a.score < b.score;
                }

                if(a.struckout) {
                    return 1;
                } else {
                    return -1;
                }

                throw new Error('Your sorting logic is terrible. Just really bad mate.');
            });


            scores.forEach( (obj, index) => {

                //Struck out ya loser
                if( this.hasStruckOut(this.players[obj.index]) ) {
                    this.players[obj.index].position = this.players.length;
                } else {

                    this.players[obj.index].position = index+1;
                }

            });
        },

        nextTurn() {

            // todo FIX BUG -- if all players struck out goes to max call stack size (i.e. infinite loop)

            if(this.whoseTurn >= this.players.length-1) {
                this.whoseTurn = 0;
            } else {
                this.whoseTurn++;
            }

            //Skip a struck out player
            if( this.hasStruckOut(this.players[this.whoseTurn]) ) {
                this.nextTurn();
            }
        },

        resetGame() {
            if(!confirm('Clear EVERYTHING and start a new game?')) {
                return;
            }
            this.players = [];
            this.scores = [];
            this.winner  = '';
            this.gameInProgress = false;
        },

        resetScores() {
            if(!confirm('Start a new game with same players?')) {
                return;
            }
            for(let i=0; i<this.players.length; i++) {
                this.players[i].score    = 0;
                this.players[i].strikes  = 0;
                this.players[i].position = 1;
                this.players[i].turns = [];
            }
            this.whoseTurn = 0;
            this.scores = [];
            this.gameInProgress = false;
        },

        // English-ify the numeric positio
        showPosition(p) {
            // 1st, 2nd, 3rd, 4th, 5th, 
            if(p >= 4) {
                return p + 'th';
            }
            switch(p) {
                case 1:
                    return '1st';
                    break;
                case 2:
                    return '2nd';
                    break;
                default:
                    return p + 'rd';
                    break;
            }
        },

        //Stub. todo: integrate with strike count, position tracking
        //This calculates score dynamically from turns, but doesn't update those things
        showScore(turns) {
            return turns.reduce((a, b) => a + b, 0);
        },

        setTheme(theme) {
            if( ['default', 'hot'].indexOf(theme) !== -1 ) {
                this.theme = theme;
                document.body.className = 'theme-' + theme;
                localStorage.setItem('theme', theme);
            }
        }
    },

    computed: {

        resetTo() {
            return Math.ceil( this.playToScore/2 );
        },

        nameForScoring() {
            if(typeof this.scoringNow.name === 'undefined') {
                return '';
            }

            let name = this.scoringNow.name;
            if(name.substr(-1) !== 's') {
                return name + "'s";
            }
            return name + "'";
        }
    },

    beforeUpdate() {
       // todo save state in localStorage for safety
    },

});

if( localStorage.getItem('theme') ) {
    let themeClass = 'theme-' + localStorage.getItem('theme');
    document.body.className = themeClass;
    document.getElementById('app').className = document.getElementById('app').className.replace('theme-default'. themeClass);
}