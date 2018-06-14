
// Finskore App
const finskore = new Vue({
    el: '#app',

    data: {
        title: 'Finskore',
        theme: 'default',

        //Config
        playToScore: 50,
        players: [],

        //Add score to this player
        thePlayerIamScoring: '', //todo: refactor name, data structure


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

        enterScoreForm(player) {
            this.thePlayerIamScoring = player.name;
            this.showScoreModal = true;
        },

        saveScore(score) {
            // todo: use the score
            // todo: find player in stack, if non-zero score, reset their strikes to 0
            this.showScoreModal = false;
        },

        //Current player missed every single piece
        // like all of them. Didn't hit a single one.
        playerStrike() {
            this.saveScore(0);
            // @todo find current player in this.players, increment their strike count
        }
    }

});