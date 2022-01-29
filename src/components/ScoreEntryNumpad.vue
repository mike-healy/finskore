<template>
  <!-- Wrapper needed so that div.score doesn't expand in height to match the history, creating very tall buttons -->
  <div>
    <div class='score' :class="{editing: mode==='update'}">
      <h3 class='edit-title'>edit score for this turn:</h3>
      <button
        v-for="score in listOfValidScores"
        v-bind:class="[score ? 'score' : 'miss']"
        @click="onScoreSelection(score)"
        v-bind:key="score"
      >
        {{ score || 'MISS' }}
      </button>
    </div> <!-- /.score -->
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

<style lang="scss" scoped>
  div.score {
    transition: background-color 0.5s;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  h3.edit-title {
    display: none;
    font-size: 0.875rem;
    font-weight: normal;
    font-family: monospace;
    text-align: left;
    margin: 0;
    grid-column-start: 1;
    grid-column-end: 3;
  }

  div.score.editing {
    border: 1px dashed #94ce56;
    padding: 2rem 1rem;
    background: rgba(38, 150, 132, 0.15);
    box-shadow: 0 0 4px 0 rgba(0,40,77, 0.2);

    h3.edit-title {
      display: block;
    }
  }

  .theme-hot div.score.editing {
    border-color: #e06b1e;
    background: rgba(150, 113, 38, 0.15);
  }

  .theme-white div.score.editing {
    background: #fff;
  }

  .score button {
      width: auto;
      //width: 35%;
      //margin: 0 0.5rem 1.5rem 0.5rem;
      margin: 0;
      padding: 0.65rem 0;
      font-weight: bold;
  }

  .score button.miss {
      //width: 90%;
      grid-column-start: 1;
      grid-column-end: 3;
      width: 100%;
      color: #e3dbab;
      background: #483c3b;
      border-color: #cca956;
  }

  .score button {
      color: #d1ffd2;
  }
</style>
