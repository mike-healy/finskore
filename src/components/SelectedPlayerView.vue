<template>
  <!-- Enter players score for a turn -->
  <form class='enterScore' @submit.prevent="saveScore()">
    <h2>{{ player.name }}</h2>

    <div class="score-container">
      <ScoreEntryNumpad @saveScore="saveScore" />
      <PlayerHistory :player="player"/>
    </div>

    <p>
      <button
        v-if="!gameInProgress"
        @click.prevent="deletePlayer"
        class="warning"
       >
        Delete
       </button>
      <button @click.prevent="showScoreModal=false" class="cancel">Cancel</button>
    </p>

    <p>
      <button
        @click="whoseTurn = player.id; showScoreModal = false;"
        class="cancel"
       >
        Set to {{ player.name }}'s turn
       </button>
    </p>
  </form>
</template>

<script>
  import PlayerHistory from './PlayerHistory.vue';
  export default {
    name: 'SelectedPlayerView',
    components: { PlayerHistory },
    props: {
      player: {
        type: Object,
        required: true
      },
      saveScore: {
        type: 'Function',
        required: true
      }
    }
  }
</script>
