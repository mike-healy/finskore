<template>
  <form @submit.prevent="handleNewPlayerFormSubmit()" class="createGame">
    <h2>Add Players now</h2>
    <p>
      <label for="newPlayer">New Player</label>
      <input ref="newPlayer" type="text" name="newPlayer" id="newPlayer" maxlength="20" required />
      <button type="submit">Add to Game</button>
    </p>

    <p class="center">
      <button @click.prevent="closeNewGameInterface()" class="cancel">close</button>
      <button @click.prevent="startGame()">Start Game</button>
    </p>
  </form>
</template>

<script>
  import Vue from 'Vue';

  export default {
    name: 'SetupGame',
    created() {
      Vue.nextTick().then(() => this.$refs.newPlayer.focus());
    },
    props: {
      addPlayer: {
        type: Function,
        required: true
      },
      closeNewGameInterface: {
        type: Function,
        required: true
      },
      startGame: {
        type: Function,
        required: true
      }
    },
    methods: {
      handleNewPlayerFormSubmit() {
        const input = this.$refs.newPlayer;
        const name = input.value;
        input.value = '';
        input.focus();
        this.addPlayer({ name })
      }
    }
  }
</script>
