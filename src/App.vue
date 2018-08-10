<template>
  <div id="app">
            <header>
                <h1>Finskore</h1>
                <p>Online scoring app for Finska, Klop &amp; Molkky</p>
            </header>

            <p v-show="!gameInProgress">
                <button @click="createNewGame()">Add Players</button>
            </p>

            <!-- DECLARE WINNER -->
            <section v-show="winner !== ''" class="winner">
                <h2>{{ winner }} Won!</h2>
                <p>
                    <button class="cancel" @click="winner=''">close</button>
                </p>
            </section>

            <!-- SETUP GAME -->
            <form v-if="setupGame" @submit.prevent="addPlayer" class="createGame">
                <h2>Add Players now</h2>
                <p>
                    <label for="newPlayer">New Player</label>
                    <input type="text" name="newPlayer" id="newPlayer" maxlength="20" required v-model="newPlayer">
                    <button @click.prevent="addPlayer">Add to Game</button>
                </p>

                <p class="center">
                    <button @click.prevent="setupGame=false" class="cancel">close</button>
                    <button @click="startGame">Start Game</button>
                </p>
            </form>


            <!-- Enter players score for a turn -->
            <form class='enterScore' v-if="showScoreModal" @submit.prevent="saveScore()">

                <h2>{{ nameForScoring }} Game</h2>

                <div class="score-container">

                    <div class='score' @click="saveScore">
                        <button data-score="0" class="miss">MISS</button>
                        <button data-score="1">1</button>
                        <button data-score="2">2</button>
                        <button data-score="3">3</button>
                        <button data-score="4">4</button>
                        <button data-score="5">5</button>
                        <button data-score="6">6</button>
                        <button data-score="7">7</button>
                        <button data-score="8">8</button>
                        <button data-score="9">9</button>
                        <button data-score="10">10</button>
                        <button data-score="11">11</button>
                        <button data-score="12">12</button>
                    </div>

                    <!-- TURN HISTORY -->
                    <div class='history' v-if="scoringNow.turns.length > 0">
                        <div class='line'></div>
                        <div class='turn' v-for="turn in scoringNow.turns">
                            {{ turn }}
                        </div>
                    </div>

                </div>

                <p>
                    <button v-if="!gameInProgress" @click.prevent="deletePlayer" class="warning">Delete</button>
                    <button @click.prevent="showScoreModal=false" class="cancel">Cancel</button>
                </p>

                <p>
                    <button @click="whoseTurn = scoringIndex; showScoreModal = false;" class="cancel">Set to {{ nameForScoring }} turn</button>
                </p>

            </form>


            <!-- LEADERBOARD -->
            <section class="leaderboard">
                
                <div v-for="(p, index) in players"
                    :key="index"
                    @click="enterScoreForm(index)"
                    class="player"
                    v-bind:class="{struckout: hasStruckOut(p), myturn: whoseTurn === index, winning: p.position === 1}">

                    <div class='pos'>{{ showPosition(p.position) }}</div>
                    <div class="player">
                        <div class="name">{{ p.name }} <img v-show="p.theyBlewIt" src="img/sad.png" alt=":("></div>
                        <div class="strikes">{{ showStrikes(p) }}</div>
                    </div>
                    <div class="score">{{ p.score }}</div>
                    <div class="togo">{{ playToScore-p.score }}</div>
                </div>
            </section>

            <p v-show="players.length > 0" class="right top-space">
                <button @click="resetGame" class="warning">Reset Everything</button>
                <button @click="resetScores">Reset Scores</button>
            </p>


            <div class='themeSwitcher'>
                <div @click="setTheme('default')" class='default'></div>
                <div @click="setTheme('hot')" class='hot'></div>
            </div>

            <footer>
                <p><small>Play to <input type="number" v-model.number="playToScore" max="1000"></small></p>

                <p>By <a href="https://www.mikehealy.com.au" rel="noopener">Mike Healy</a>. <a href="https://github.com/mike-healy/finskore" target="fsgh" rel="noopener">Finskore on Github</a></p>
            </footer>

        </div> <!-- /#app -->
  </div>
</template>

<script>
export default {
    name: 'app',

    data () {
        return {
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
        }
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

        // English-ify the numeric position
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
            let name = this.scoringNow.name;
            if(name.substr(-1) !== 's') {
                return name + "'s";
            }
            return name + "'";
        }
    }
}

if( localStorage.getItem('theme') ) {
    let themeClass = 'theme-' + localStorage.getItem('theme');
    document.body.className = themeClass;
    document.getElementById('app').className = document.getElementById('app').className.replace('theme-default'. themeClass);
}
</script>

<style lang="scss">
</style>
