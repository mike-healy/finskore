<template>
  <!-- Enter players score for a turn -->
  <form class='enterScore' @submit.prevent>
    <h2><PlayerNamePossesive :name="player.name" /> Game</h2>

    <div class="score-container">
      <ScoreEntryNumpad :onScoreSelection="scoreSelected" />
      <PlayerHistory :player="player" @updateHistory="updateHistory" />
    </div>

    <p>
      <button
        v-if="!gameInProgress"
        @click.prevent="deletePlayer(player.id)"
        class="warning"
       >
        Delete
      </button>
      <button @click.prevent="cancel" class="cancel">Cancel</button>
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
      scoreSelected(score) {
        this.saveScore({ score, playerId: this.player.id })
      },
      updateHistory(turns) {
        this.$emit('updateHistory', turns)
      }
    }
  }
</script>
