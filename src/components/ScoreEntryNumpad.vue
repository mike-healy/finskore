<template>
  <!-- Wrapper needed so that div.score doesn't expand in height to match the history, creating very tall buttons -->
  <div>
    <div class='score' :class="{editing: mode==='update'}">
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
    transition: padding 0.5s;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  div.score.editing {
    border: 1px dashed #94ce56;
    padding: 2rem 0;
    background: rgba(38, 150, 132, 0.15);
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
  }

  .score button {
      color: #d1ffd2;
  }
</style>
