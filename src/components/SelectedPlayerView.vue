<template>
  <!-- Enter players score for a turn -->
  <form class='enterScore' @submit.prevent>
    <h2><PlayerNamePossesive :name="player.name" /> Game</h2>

    <div class="score-container">

      <!-- NEW score (i.e. not editing any index) -->
      <ScoreEntryNumpad v-if="editTurnIndex === -1" :onScoreSelection="scoreSelected" />

      <!-- EDIT existing score -->
      <ScoreEntryNumpad
        v-else
        mode="update"
        :editTurnIndex="editTurnIndex"
        :onScoreSelection="scoreUpdated"
      />

      <PlayerHistory
        :player="player"
        @editingScore="editScoreMode"
        @updateHistory="turn => $emit('updateHistory', turn)"
      />

    </div>

    <p>
      <button
        v-if="!gameInProgress"
        @click.prevent="deletePlayer(player.id)"
        class="warning"
       >
        Delete
      </button>
      <button @click.prevent="cancel" class="cancel">Close</button>
    </p>

    <p>
      <button
        @click="changeWhoseTurnItIs(player.id)"
        class="cancel"
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

      scoreSelected(score) {
        this.saveScore({ score, playerId: this.player.id })
      },

      scoreUpdated(score) {
        this.$emit('updateHistory', {turnIndex: this.editTurnIndex, newScore: score});
      }

    }
  }
</script>
