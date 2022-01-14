<template>
  <form @submit.prevent="handleNewPlayerFormSubmit()" class="createGame" id="createGame">
    <header>
      <h2>Add Players</h2>
      <button type="button" @click.prevent="closeNewGameInterface()" class="cancel" aria-label="close" aria-controls="createGame">&#215;</button>
    </header>

    <div class='addPlayerContainer'>
      <div>
        <input ref="newPlayer" type="text" name="newPlayer" id="newPlayer" maxlength="20" required="required" placeholder="Player Name">
      </div>
      <button type="submit" style="margin: 0;">+ Add</button>
    </div>

    <p class="startRow right">
      &nbsp;
      <button v-show="$parent.players.length > 0" @click.prevent="startGame()">Start Game</button>
    </p>
  </form>
</template>

<script>
  import Vue from 'vue';

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

<style scoped lang="scss">
  header {
    display: flex;
    align-items: center;
    margin-bottom: 2rem;

    h2 {
      flex-grow: 1;
      margin: 0;
    }

    button {
      flex-shrink: 1;
      display: block;
      width: 4ch;
      margin: 0;
    }
  }

  p.startRow {
    margin-left: auto;
    margin-right: auto;
    max-width: 30rem;
  }
</style>