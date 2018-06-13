
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
        setupGame: false,
        newPlayer: '',
    },
    
    methods: {
        createNewGame() {
            this.setupGame = true;
            console.log('creating game');
        },

        startGame() {
            this.setupGame = false;
            console.log('starting game');
        },

        addPlayer() {
            console.log('adding player');
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
       }
    }

});