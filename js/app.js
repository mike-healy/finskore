
// Finskore App
const finskore = new Vue({
    el: '#app',

    data: {
        title: 'Finskore',
        theme: 'default',

        //Config
        playToScore: 50,
        resetTo:     25,
        players: [],

        scoringNow: {}, //instance of current player being scored
        whoseTurn: 0,   //index
        
        scores: [],     //{i: , score: } objects, also kept in player index order. 
        positions: [],  //player indices in ranking order

        //State
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
            this.players.push({
                name: this.newPlayer,
                score: 0,
                strikes: 0
            });

            //Copy of scores for sorting to show position
            let index = this.scores.length;
            this.scores.push({
                i: index,
                score: 0
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

        /* 
        Update scores array for sorting into positions
        */
        updatePositions(index, score) {
            this.scores[index] = {
                i: index,
                score: this.scoringNow.score
            };

            this.positions = this.scores.sort(function(a,b) {
                return a.score > b.score;
            });
        },


        //This is buggy, when player strikes out it's going to previous one
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
            this.positions = [];
            this.winner  = '';
        },

        resetScores() {
            if(!confirm('Start a new game with same players?')) {
                return;
            }
            for(let i=0; i<this.players.length; i++) {
                this.players[i].score   = 0;
                this.players[i].strikes = 0;
            }
            this.whoseTurn = 0;
            this.scores = [];
            this.positions = [];
        },

        // TEMPORARY
        position() {
            return '--';
        }
    },

    computed: {
        nameForScoring() {
            let name = this.scoringNow.name;
            if(name.substr(-1) !== 's') {
                return name + "'s";
            }
            return name + "'";
        }
    }

});