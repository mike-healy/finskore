<template>
  <div id="app">
    <main>
        <slot>
            <header class="container">
                <h1>Finskore</h1>
                <p>A free browser-based scoring app for Finska, Klop &amp; Molkky</p>
            </header>
        </slot>

        <p v-show="!gameInProgress" class="center">
          <button @click="openNewGameInterface()">Add Players</button>
          <button v-show="players.length >= 2" @click="runShuffleOrder()" class="cancel" style="margin-left: 1rem;">Shuffle Order</button>
        </p>
        <!-- DECLARE WINNER -->
        <transition name="slide-fade">
            <section v-show="winner !== ''" class="winner">
                <h2>{{ winner }} Won!</h2>
                <p>
                    <button class="cancel" @click="winner=''">close</button>
                </p>
            </section>
        </transition>
        <SetupGame
          v-if="showNewGameInterface"
          :addPlayer="addPlayer"
          :startGame="startGame"
          :closeNewGameInterface="closeNewGameInterface"
        />
        <transition name="slide-fade">
            <div v-if="flashMessage" v-focus tabindex="-1" class="flashMessage" aria-live="assertive">{{ flashMessage }}</div>
        </transition>
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
        <Arrangement
            :showArrangementGuide = showArrangementGuide
            @hide="showArrangementGuide = false"
            v-show="showArrangementGuide"
        />
        <p v-show="players.length > 0" class="center top-space">
          <button @click="resetGame" class="warning">Reset Everything</button>
          <button @click="resetScores">Reset Scores</button>
        </p>
    </main>

    <div class="controls">
        <div>
            <p>Play to <br>
            <input type="number" v-model.number="playToScore" max="1000"></p>
        </div>

        <div>
            <button @click="showArrangementGuide = !showArrangementGuide" class="arrangement">
              <img src="img/arrangement.png" class="arrangement" alt="Show arrangement" width="60" height="40">
            </button>
        </div>

        <div class='themeSwitcher'>
            <div @click="setTheme('white')" class='white'></div>
            <div @click="setTheme('default')" class='default'></div>
            <div @click="setTheme('hot')" class='hot'></div>
        </div>
    </div>

    <footer>
        <a href="https://github.com/mike-healy/finskore" target="fsgh" rel="noopener">Finskore on Github</a>
        <PhotoCredit :christmas="christmas" :theme="theme" />
    </footer>

    <small class="version">v105</small>

  </div> <!-- /#app -->
</template>

<script>
//A11Y
Vue.directive('focus', {
  inserted: function (el) {
    el.focus();
  },
});

import Vue from 'vue';
import Leaderboard from './components/Leaderboard';
import SelectedPlayerView from './components/SelectedPlayerView';
import SetupGame from './components/SetupGame';
import Arrangement from './components/Arrangement';
import PhotoCredit from './components/PhotoCredit';
import Finskore from './Finskore';
import PosthogPlugin from './plugins/posthog';

Vue.use(PosthogPlugin);

export default {
    components: {
      Leaderboard,
      SelectedPlayerView,
      Arrangement,
      SetupGame,
      PhotoCredit,
    },
    name: 'app',

    data () {
        return {
            shufflerInterval: null,
            shuffleCount: 0,

            theme: 'default',
            christmas: false,
            showArrangementGuide: false,

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
            winner: '',

            flashMessage: ''
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
            this.turnIndex = 0;

            this.$posthog.capture('game_started', {
                player_count: this.players.length
            });
        },

        addPlayer({ name }) {
          this.players = Finskore.addPlayer({name, players: this.players});
        },

        runShuffleOrder(action) {
            action = action || 'start';

            if(action === 'start') {
                this.shufflerInterval = setInterval(this.shuffleOrder, 150);
                return;
            }

            //Stop shuffling
            this.shuffleCount = 0;
            clearInterval(this.shufflerInterval);
        },

        shuffleOrder() {

            if(this.players.length < 2) {
                return;
            }

            const reducer = (accumulator, current) => accumulator + current.id;
            const prevOrder = this.players.reduce(reducer, '');

            while(this.players.reduce(reducer, '') === prevOrder) {
                this.shuffleCount++;
                this.players.sort( function(a,b) {
                        return (Math.random() < 0.5) ? -1 : 1;
                });
            }

            if(this.shuffleCount >= 6) {
                this.runShuffleOrder('stop');
            }
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

        clearFlashMessage() {
            this.flashMessage = '';
        },

        //@var index player index
        handlePlayerSelectedFromLeaderboard(player) {
            this.selectedPlayer = player;
            this.setupGame = false;
            this.showScoreModal = true;
        },

        updateHistory({ turnIndex, newScore }) {

            /*
            turnIndex is from opposite direction to the turn history in the player's timeline.
            Flip the index to refer to correct position in source array, otherwise we're updating the wrong score
            */
            turnIndex = this.selectedPlayer.turns.length-turnIndex-1

            this.selectedPlayer.turns[turnIndex] = newScore

            const index = this.selectedPlayerIndex
            const { turns } = this.players[index]

            turns[turnIndex] = newScore

            /**
            * Figure out why $watch doesn't pay attention to this change.
            */
            Object.assign(this.players[index], { turns })

            /**
            * HACK: Just manually update the player score.
            * (acts to clear computed, to trigger recalculation)
            */
            let newTotal = this.selectedPlayer.turns.reduce((sum, turn) => { //not DRY :(
                let subtotal = sum + turn;
                return subtotal > this.playToScore ? this.resetTo : subtotal;
            }, 0);

            this.selectedPlayer.score = newTotal;
            this.players[index].score = newTotal;

            //strikes don't update :(
            this.updatePositions();

            //Close modal, flash message
            this.showScoreModal = false;
            this.flashMessage = 'Score Updated';
            setTimeout(this.clearFlashMessage, 2000);
        },

        saveScore({ score, playerId }) {
            if(typeof score === 'undefined') {
                return;
            }
            const selectedPlayer = this.players.find((player) => (player.id === playerId));

            let index = this.players.indexOf(selectedPlayer);

            this.gameInProgress = true;
            this.showScoreModal = false;

            this.$posthog.capture('score_entered', {
                score: score
            });

            // Hit or miss
            score === 0
                ? selectedPlayer.strikes++
                : selectedPlayer.strikes = 0;

            selectedPlayer.turns.push(score);
            selectedPlayer.score += score;

            //Too many points. Congratulations, you played yourself
            if(selectedPlayer.score > this.playToScore) {
                selectedPlayer.theyBlewIt = true;
                selectedPlayer.score = this.resetTo;
            } else {
                selectedPlayer.theyBlewIt = false;
            }

            //Copy score for sorting
            this.updatePositions(index, selectedPlayer.score);

            //Declare winner
            if(selectedPlayer.score === this.playToScore) {
                this.winner = selectedPlayer.name;

                this.$posthog.capture('game_won', {
                    throws: selectedPlayer.turns.length,
                });

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

                if ((!a.struckout && !b.struckout) ||
                    (a.struckout && b.struckout)) {

                    return (a.score < b.score) ? 1 : -1;
                }

                if (a.struckout) {
                    return 1;
                } else {
                    return -1;
                }

                throw new Error('Your sorting logic is terrible. Just really bad mate.');
            });

            let prevScore = 0;
            let prevRankingPosition = 0;

            scores.forEach( (obj, index) => {
                if ( Finskore.hasStruckOut(this.players[obj.index]) ) {
                    this.players[obj.index].position = this.players.length;
                } else {

                    //Tied with previous score, share their ranking position (there can be 3+ way ties)
                    if (obj.score === prevScore) {
                        this.players[obj.index].position = prevRankingPosition;
                    } else {
                        this.players[obj.index].position = index+1;
                        prevRankingPosition = index+1;
                    }
                }

                prevScore = obj.score;
            });
        },

        nextTurn() {
            // todo FIX BUG -- if all players struck out goes to max call stack size (i.e. infinite loop)
            // matters slightly more because you can now retrospectively change a historical turn to a strike. Still edge case

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

            this.$posthog.capture('game_reset');
        },

        resetScores() {
            if(!confirm('Start a new game with same players?')) {
                return;
            }
            for(let i=0; i<this.players.length; i++) {
                this.players[i].score    = 0;
                this.players[i].strikes  = 0;
                this.players[i].position = 1;
                this.players[i].theyBlewIt = false;
                this.players[i].turns = [];
            }
            this.whoseTurn = 0;
            this.scores = [];
            this.gameInProgress = false;
            this.winner = '';

            this.$posthog.capture('score_reset');
        },

        //Stub. todo: integrate with strike count, position tracking
        //This calculates score dynamically from turns, but doesn't update those things
        showScore(turns) {
            return turns.reduce((a, b) => a + b, 0);
        },

        setTheme(theme) {
            if( ['default', 'hot', 'white'].indexOf(theme) === -1 ) {
                return;
            }

            this.theme = theme;

            //Remove old theme- classes first
            document.body.classList.forEach( function(c) {
                if( c.substr(0, 6) === 'theme-' ) {
                    document.body.classList.remove(c);
                }
            });

            document.body.classList.add('theme-' + theme);
            localStorage.setItem('theme', theme);
        },

        specialEventTheme() {
            let d = new Date();

            const isChristmas = (d) => d.getMonth() === 11 && (d.getDate() >= 10 && d.getDate() <= 30);

            if (isChristmas(d)) {
                document.body.classList.add('christmas');
                this.christmas = true;
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

                //todo: can we check for 3 strikes in a row here to strike out player?
                // (so that it happens on history change too)

                updatedPlayers.forEach((player, index) => {

                  //Back to
                  // if they bust over 50 this isn't recalcing. Why?
                  this.players[index].score = player.turns.reduce(((sum, turn) => {
                      let subtotal = sum + turn;
                      return subtotal > this.playToScore ? this.resetTo : subtotal;
                  }), 0);

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

        this.specialEventTheme();

        //Hacky -- update state with theme by sniffing DOM
        //Theme change event already handled
        let app = this;

        ['theme-white', 'theme-default'].forEach(function(t) {
            let theme = t.replace('theme-', '');

            if(document.body.classList.contains(t)) {
                app.setTheme(theme);
            }
        });
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
    document.body.classList.add(themeClass);
    document.getElementById('app').className = document.getElementById('app').className.replace('theme-default'. themeClass);
}

</script>

<style lang="scss">
div.controls {
    margin-top: 2rem;
    display: flex;
    //flex-grow: 1; //how to occupy full width
    justify-content: center;
    font-size: 0.875rem;

    > :first-child {text-align: left;}
    > :last-child {text-align: right;}

    p {margin: 0;}

    > div {
        flex: 2;
        text-align: center;
    }

    > div.themeSwitcher {
        flex: 3;
    }
}

.controls input[type=number] {
    margin-top: 0.3rem;
    padding: 0.6rem;
    font-size: inherit;
    background: #124a61;
    color: #cffbd0;
    width: 8ch;
}

.theme-hot .controls input[type=number] {
    background: #2b0f01;
    color: #fde5b5;
}


img.arrangement {
    border-radius: 4px;
    max-width: 60px;
    box-shadow: 1px 1px 3px rgba(0,0,0,0.2);
}

button.arrangement {
  border: none;
  padding: 0;
  background: transparent;
  font-size: initial;
}

div.flashMessage {
    text-align: center;
    background: #1d1d1d;
    padding: 1rem;
    margin-bottom: 1rem;
}

.theme-white div.flashMessage {
    background: #e86614;
    color: #fff;
}

.slide-fade-enter-active {
  transition: all .8s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s; //all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to {
  opacity: 0;
}

small.version {
    display: block;
    margin-top: 2rem;
    opacity: 0.4;
}
</style>
