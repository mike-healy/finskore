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

    <SetupGame
      v-if="showNewGameInterface"
      :addPlayer="addPlayer"
      :startGame="startGame"
      :closeNewGameInterface="closeNewGameInterface"
    />

    <SelectedPlayerView
      v-if="showScoreModal"
      @updateHistory="updateHistory"
      :player="selectedPlayer"
      :gameInProgress="gameInProgress"
      :saveScore="saveScore"
      :cancel="closeSelectedPlayer"
      :changeWhoseTurnItIs="changeWhoseTurnItIs"
      :deletePlayer="deletePlayer"
    />

    <Leaderboard
      :players="players"
      :currentTurnPlayerId="whoseTurn"
      :playToScore="playToScore"
      @selectPlayer="handlePlayerSelectedFromLeaderboard"
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
</template>

<script>
  import Vue from 'vue';
  import Leaderboard from './components/Leaderboard.vue';
  import SelectedPlayerView from './components/SelectedPlayerView';
  import SetupGame from './components/SetupGame';
  import Finskore from './Finskore';

export default {
    components: {
      Leaderboard,
      SelectedPlayerView,
      SetupGame
    },
    name: 'app',

    data () {
        return {
            theme: 'default',

            //Config
            playToScore: 50,
            players: [],

            //State
            selectedPlayer: undefined, //instance of current player being scored
            whoseTurn:  0,   //index

            gameInProgress: false,
            showNewGameInterface: false,
            showScoreModal: false,
            newPlayer: '',
            winner: ''
        }
    },

    methods: {
        changeWhoseTurnItIs(playerId) {
          const selectedPlayer = this.players.find((player) => (player.id === playerId));
          const selectedPlayerIndex = this.players.indexOf(selectedPlayer)
          this.whoseTurn = selectedPlayerIndex;
          this.showScoreModal = false;
        },
        closeSelectedPlayer() {
          this.showScoreModal = false;
        },
        openNewGameInterface() {
            this.showNewGameInterface = true;
        },
        closeNewGameInterface() {
            this.showNewGameInterface = false;
        },
        startGame() {
            this.showNewGameInterface = false;
            this.gameInProgress = true;
        },

        addPlayer({ name }) {
          this.players = Finskore.addPlayer({name, players: this.players});
        },

        deletePlayer(playerId) {
          const selectedPlayer = this.players.find((player) => (player.id === playerId));
          const selectedPlayerIndex = this.players.indexOf(selectedPlayer)

          if(!confirm('Remove ' + selectedPlayer.name + ' from the game?')) {
              return;
          }

          this.players.splice(selectedPlayerIndex, 1);
          this.showScoreModal = false;
        },

        //@var index player index
        handlePlayerSelectedFromLeaderboard(player) {
            this.selectedPlayer = player;
            this.setupGame = false;
            this.showScoreModal = true;
        },

        updateHistory({ turnIndex, newScore }) {
          this.selectedPlayer.turns[turnIndex] = newScore

          const index = this.selectedPlayerIndex

          this.players[index].turns[turnIndex] = newScore
        },

      saveScore({ score, playerId }) {
            if(typeof score === 'undefined') {
                return;
            }
          const selectedPlayer = this.players.find((player) => (player.id === playerId));

            let index = this.players.indexOf(selectedPlayer);

            this.gameInProgress = true;
            this.showScoreModal = false;

            //Swing and a miss
            if(score === 0) {
                selectedPlayer.strikes++;
            }

            selectedPlayer.turns.unshift(score);
            selectedPlayer.score += score;

            //OVER QUOTA -- Whoops
            if(selectedPlayer.score > this.playToScore) {
                selectedPlayer.score = this.resetTo;
                selectedPlayer.turns.unshift(':(');
                selectedPlayer.theyBlewIt = true;
            } else {
                selectedPlayer.theyBlewIt = false;
            }

            //Copy score for sorting
            this.updatePositions(index, selectedPlayer.score);

            //Reset strikes if they got a hit
            if(score > 0) {
                selectedPlayer.strikes = 0;
            }

            //Declare winner
            if(selectedPlayer.score === this.playToScore) {
                this.winner = selectedPlayer.name;
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
                    struckout: Finskore.hasStruckOut(player)
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
                if( Finskore.hasStruckOut(this.players[obj.index]) ) {
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
            if( Finskore.hasStruckOut(this.players[this.whoseTurn]) ) {
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
            let name = this.selectedPlayer.name;
            if(name.substr(-1) !== 's') {
                return name + "'s";
            }
            return name + "'";
        },

        selectedPlayerIndex() {
          return this.players.indexOf(this.selectedPlayer)
        }
    },

    watch: {

        players: {
            handler(updatedPlayers) {
                updatedPlayers.forEach((player, index) => {
                  this.players[index].score = player.turns.reduce(((a, b) => a + b), 0);
                })
            },
            deep: true
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
