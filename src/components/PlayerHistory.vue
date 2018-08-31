<template>
  <div class='history' v-if="player.turns.length > 0">
    <div class='line'></div>
    <div class='turn' v-for="(turn, index) in player.turns" :key="index" @input="updateScore($event, index)" contenteditable>
      {{ turn ? turn : ':(' }}
    </div>
  </div>
</template>

<script>
  export default {
    name: 'PlayerHistory',
    props: {
      player: {
        type: Object,
        required: true,
      }
    },
    methods: {
      updateScore($event, index) {
        const newScore = parseInt($event.target.innerHTML)

        if (newScore) {
          this.player.turns[index] = newScore

          this.$emit('updateHistory', {
            turnIndex: index,
            newScore
          })
        }
      }
    }
  }
</script>

<style lang="scss">
  .history {
      margin: 2rem auto;
      max-width: 150px;
      position: relative;
  }

  .history .line {
      position: absolute;
      z-index: 3;
      left: 49%;
      width: 3px;
      height: 100%;
      background: #19596c;
  }

  .history .turn {
      position: relative;
      z-index: 6;
      margin-bottom: 1rem;
      width: 3rem;
      height: 3rem;
      line-height: 3rem;
      border-radius: 50%;
      text-align: center;
      background: #19596c;
      color: #77c97c;
  }
</style>
