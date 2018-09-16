<template>
  <div class='score' :class="{editing: mode==='update'}">
      <!--
      @click="$emit('updateHistory')"

        -->
    <button
      v-for="score in listOfValidScores"
      v-bind:class="[score ? 'score' : 'miss']"
      @click="onScoreSelection(score)"
      v-bind:key="score"
    >
      {{ score || 'MISS' }}
    </button>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        listOfValidScores: Array.from(Array(13).keys()) // creates array 0 to 12
      }
    },

    props: {
      onScoreSelection: {
        type: Function,
        required: true
      },

      mode: {
        type: String,
        default: 'add',
        validator: function(value) {
          return ['add', 'update'].indexOf(value) !== -1;
        }
      },

      editTurnIndex: {
        type: Number,
        default: -1
      }

    }
  };
</script>

<style lang="scss">
  div.score {
    transition: padding 1s;
  }

  div.score.editing {
    border: 1px dashed #94ce56;
    padding: 2rem 0;
    background: rgba(38, 150, 132, 0.15);
  }

  .score button {
      width: 35%;
      margin: 0 0.5rem 1.5rem 0.5rem;
      font-weight: bold;
  }

  .score button.miss {
      width: 90%;
  }

  .score button {
      color: #d1ffd2;
  }
</style>
