<template>
  <div id="app">
            <header>
                <h1>Finskore</h1>
                <p>Online scoring app for Finska, Klop &amp; Molkky</p>
            </header>

            <p v-show="!gameInProgress">
                <button @click="openNewGameInterface()">Add Players</button>
            </p>

            <!-- DECLARE WINNER -->
            <section v-show="winner !== ''" class="winner">
                <h2>{{ winner }} Won!</h2>
                <p>
                    <button class="cancel" @click="winner=''">close</button>
                </p>
            </section>

            <!-- SETUP GAME -->
            <form v-if="showNewGameInterface" @submit.prevent="handleNewPlayerFormSubmit" class="createGame">
                <h2>Add Players now</h2>
                <p>
                    <label for="newPlayer">New Player</label>
                    <input ref="newPlayer" type="text" name="newPlayer" id="newPlayer" maxlength="20" required />
                    <button type="submit">Add to Game</button>
                </p>

                <p class="center">
                    <button @click.prevent="showNewGameInterface=false" class="cancel">close</button>
                    <button @click="startGame">Start Game</button>
                </p>
            </form>


            <!-- Enter players score for a turn -->
            <form class='enterScore' v-if="showScoreModal" @submit.prevent="saveScore()">

                <h2>{{ nameForScoring }} Game</h2>

                <div class="score-container">

                    <ScoreEntryNumpad @saveScore="saveScore" />

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
            <Leaderboard
              :players="players"
              :currentTurnPlayerId="whoseTurn"
              :playToScore="playToScore"
              @selectPlayer="enterScoreForm"
            />

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
	import Vue from 'vue';
  import ScoreEntryNumpad from './components/ScoreEntryNumpad.vue';
  import Leaderboard from './components/Leaderboard.vue';
  import { hasStruckOut, addPlayer } from './Finskore';

export default {
    components: { ScoreEntryNumpad, Leaderboard },
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
            showNewGameInterface: false,
            showScoreModal: false,
            newPlayer: '',
            winner: ''
        }
    },

    methods: {
        openNewGameInterface() {
            this.showNewGameInterface = true;
            Vue.nextTick().then(() => this.$refs.newPlayer.focus());
        },

        startGame() {
            this.showNewGameInterface = false;
        },

				handleNewPlayerFormSubmit() {
					const input = this.$refs.newPlayer;
					this.addPlayer({
						name: input.value,
						listOfPlayers: this.players,
					});
					input.value = '';
					input.focus();
				},

        addPlayer: addPlayer,

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

        //@var index player index
        enterScoreForm(index) {

            //this.scoringNow.index = index;
            this.scoringIndex = index;
            this.scoringNow = this.players[index];

            this.showScoreModal = true;
            this.setupGame = false;
            
        },

        saveScore(value) {

            if(typeof value === 'undefined') {
                return;
            }
            
            let score = value;
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
                    struckout: hasStruckOut(player)
                });
            });

            scores.sort(function(a,b) {
                
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
                if( hasStruckOut(this.players[obj.index]) ) {
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
            if( hasStruckOut(this.players[this.whoseTurn]) ) {
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
    },

    created() {
        //read state from local storage
        if(localStorage.getItem('finskoreState')) {
            let state = JSON.parse(localStorage.getItem('finskoreState'));

            if(typeof state.players !== 'undefined') {
                this.players = state.players;
            }
            this.playToScore = (!isNaN(state.playToScore) && state.playToScore > 0) ? state.playToScore : 50;
            this.whoseTurn = state.whoseTurn;
        }
    },

    updated() {
        //Save state to localStorage in case of refresh
        let state = {
            playToScore: this.playToScore,
            players: this.players,
            whoseTurn: this.whoseTurn
        };

        localStorage.setItem('finskoreState', JSON.stringify(state));
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
