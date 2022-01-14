<template>
  <!-- Enter players score for a turn -->
  <form class='enterScore' @submit.prevent>
    <header>
      <h2><PlayerNamePossesive :name="player.name" /> Game</h2>
      <button @click.prevent="cancel" class="close">&#215;</button>
    </header>

    <div class="score-container">

      <!-- NEW score (i.e. not editing any index) -->
      <ScoreEntryNumpad
        v-if="editTurnIndex === -1"
        :onScoreSelection="scoreSelected"
      />

      <!-- EDIT existing score -->
      <ScoreEntryNumpad
        v-else
        mode="update"
        :editTurnIndex="editTurnIndex"
        :onScoreSelection="scoreUpdated"
      />

      <PlayerHistory
        :player="player"
        @addScoreMode="editTurnIndex = -1"
        @editingScore="editScoreMode"
        @updateHistory="turn => $emit('updateHistory', turn)"
      />

    </div>

    <div v-if="!gameInProgress" class="close-delete">
      <div class="left">
        <button @click.prevent="cancel" class="cancel">Close</button>
      </div>

      <div class="right">
        <button
          @click.prevent="deletePlayer(player.id)"
          class="warning"
         >
          Delete
        </button>
      </div>
    </div>

    <!-- Todo: keep modal open and show 'done' when turn changed. 
    Users would set their turn to also score for them -->
    <p v-if="gameInProgress" class="right">
      <button
        @click="changeWhoseTurnItIs(player.id)"
        class="cancel auto"
       >
        Set to <PlayerNamePossesive :name="player.name" /> turn
      </button>
    </p>
  </form>
</template>

<script>
  import ScoreEntryNumpad from './ScoreEntryNumpad.vue';
  import PlayerHistory from './PlayerHistory.vue';
  import PlayerNamePossesive from './PlayerNamePossesive.vue';

  export default {
    name: 'SelectedPlayerView',

    data() {
      return {
        editTurnIndex: -1  //-1 is not editing a score (add mode)
      };
    },

    components: { PlayerHistory, ScoreEntryNumpad, PlayerNamePossesive },
    
    props: {
      player: {
        type: Object,
        required: true
      },
      gameInProgress : {
        type: Boolean,
        required: true
      },
      saveScore: {
        type: Function,
        required: true
      },
      deletePlayer: {
        type: Function,
        required: true
      },
      cancel: {
        type: Function,
        required: true
      },
      changeWhoseTurnItIs: {
        type: Function,
        required: true
      }
    },

    methods: {
      editScoreMode(index) {
        this.editTurnIndex = index;
      },

      //Handle NEW score
      scoreSelected(score) {
        this.saveScore({ score, playerId: this.player.id })
      },

      //Handle Updated score
      scoreUpdated(score) {
        this.$emit('updateHistory', {
          turnIndex: this.editTurnIndex,
          newScore: score
        });
      }

    }
  }
</script>

<style scoped lang="scss">
  header {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;

    h2 {
      flex-grow: 1;
      margin: 0;
    }
    
    button {
      width: auto;
      margin: 0;
      padding: 0.5rem 1rem;
      flex-shrink: 1;
    }
  }

  div.close-delete {
    display: flex;
    margin-top: 2rem;

    > div {
      flex-grow: 1;
    }
  }
</style>