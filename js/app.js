
// Finskore App
const finskore = new Vue({
    el: '#app',

    data: {
        title: 'Finskore',
        theme: 'default',

        //Config
        playToScore: 50,
        resetTo:     25,
        players: [
            {name: 'Mike', score: 0, strikes: 1},
            {name: 'Simon', score: 0, strikes: 0},
            {name: 'Trish', score: 0, strikes: 0},
            {name: 'Marinus', score: 0, strikes: 0}
        ],

        //instance of current player being scored
        scoringNow: {},

        //State
        setupGame: false,
        showScoreModal: false,
        newPlayer: '',
    },
    
    methods: {
        createNewGame() {
            this.setupGame = true;
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

            this.showScoreModal = false;

            //todo detect if game has been won
        },

        // TEMPORARY
        position() {
            return Math.round(Math.random()*100);
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