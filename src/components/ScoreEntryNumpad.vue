<template>
  <div class='score'>
    <button
      v-for="score in listOfValidScores"
      @click="$emit('saveScore', score)"
      v-bind:class="[score ? 'score' : 'miss']"
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
    }
  };
</script>

<style lang="scss">
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
