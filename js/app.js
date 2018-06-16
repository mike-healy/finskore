
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
                strikes: 0,
                position: 1  //everyone's a winner, until they're not
            });

            this.newPlayer = '';
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
            this.scoringNow = this.players[index];

            this.showScoreModal = true;
            this.setupGame = false;

            setTimeout(function() {
                document.getElementById('addScore').focus();
            }, 40);
        },

        saveScore() {

            let score = parseInt(document.getElementById('addScore').value);
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

            this.scoringNow.score += score;

            //OVER QUOTA -- Whoops
            if(this.scoringNow.score > this.playToScore) {
                this.scoringNow.score = this.resetTo;
                this.scoringNow.theyBlewIt = true; //they sure did!
            }
            
            //Copy score for sorting
            this.updatePositions(index, this.scoringNow.score);

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

        // Update scores array for sorting into positions
        updatePositions(index, score) {
            
            let scores = [];
            
            this.players.forEach( (player, index) => {
                scores.push({
                    index: index,
                    score: player.score
                });
            });

            scores.sort( function(a,b) { 
                return a.score < b.score; //higher first
            });


            scores.forEach( (obj, index) => {
                this.players[obj.index].position = index+1;
            });
        },

        nextTurn() {

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
            //this.positions = [];
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
            }
            this.whoseTurn = 0;
            this.scores = [];
            //this.positions = [];
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
        }
    },

    computed: {

        resetTo() {
            return Math.ceil( this.playToScore/2 );
        },

        nameForScoring() {
            let name = this.scoringNow.name;
            if(name.substr(-1) !== 's') {
                return name + "'s";
            }
            return name + "'";
        }
    }

});
