<template>
  <form @submit.prevent="handleNewPlayerFormSubmit()" class="createGame">
    <h2>Add Players</h2>

    <div class='addPlayerContainer'>
      <div>
        <input ref="newPlayer" type="text" name="newPlayer" id="newPlayer" maxlength="20" required="required" placeholder="Player Name">
      </div>
      <button type="submit" style="margin: 0;">+ Add to Game</button>
    </div>

    <p class="center">
      <button @click.prevent="closeNewGameInterface()" class="cancel" style="margin-right: 8px;">close</button>
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
