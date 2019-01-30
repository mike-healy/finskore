<template>
  <div class='history' v-if="player.turns.length > 0">
    <div class='line'></div>
    <div class="turn" @click="addScoreMode()" :class="{editing: editingTurnIndex === null}"></div>
    <div
      v-for="(turn, index) in turnHistory"
      :key="index"
      class='turn'
      :class='{editing: editingTurnIndex === index}'
      @click="enterScoreMode($event, index)"
    >
      {{ turn ? turn : '&times;' }}
    </div>
  </div>
</template>

<script>
// @blur="updateScore($event, index)"

  export default {
    name: 'PlayerHistory',
    
    props: {
      player: {
        type: Object,
        required: true,
      }
    },

    data() {
      return {
        editingTurnIndex: null,
        turnHistory: []
      }
    },

    created() {
      this.turnHistory = this.player.turns.slice(); //copy
      this.turnHistory.reverse();
    },

    methods: {

      //Return to Adding new score after selecting edit mode
      addScoreMode() {
        this.editingTurnIndex = null;
        this.$emit('addScoreMode');
      },

      //Render number pad component to edit this score
      enterScoreMode($event, index) {

        //Cannot edit negative adjustment back to resetTo score
        if(this.player.turns[index] < 0) {
          return;
        }

        this.$emit('editingScore', index);
        this.editingTurnIndex = index;
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

  .history .turn.editing {
    background: #77c97b;
    background: radial-gradient(#b4e857, #4f9853); //todo color theme
    color: #143e4a;
    font-weight: bold;
  }

  .theme-hot .history .turn.turn.editing {
    background: #e06b1e;
    background: radial-gradient(#FFC107, #e06b1e);
  }
</style>
