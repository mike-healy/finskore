
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

        //instance of current player being scored
        scoringNow: {},
        whoseTurn: 0,

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
            }, 50);
        },

        saveScore() {

            let score = parseInt(document.getElementById('addScore').value);

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
            
            //Reset strikes if they got a hit
            if(score > 0) {
                this.scoringNow.strikes = 0;
            }

            //Declare winner
            if(this.scoringNow.score === this.playToScore) {
                this.winner = this.scoringNow.name;
            }

            this.showScoreModal = false;
            this.nextTurn();

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
            if(!confirm('Clear everything & start a new game?')) {
                return;
            }
            this.players = [];
            this.winner  = '';
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