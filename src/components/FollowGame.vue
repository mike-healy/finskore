<template>
    <transition name="slide-fade">
    <div v-if="!existingGame">
        <p v-show="!followFormModal" class="center">
            <button @click="followFormModal = true">Follow a Game</button>
        </p>

        <form v-show="followFormModal" class='follow-modal'>
            <h2>Game ID</h2>
            <p>
                <label for="followCode">Enter the Game ID from your host</label>
                <input type="text" maxlength="6" id="followCode">
            </p>
            <p class='actions'>
                <button type="submit">Follow Game</button>
                <button @click.prevent="followFormModal = false" class="cancel">cancel</button>
            </p>
        </form>
    </div>
    </transition>
</template>

<script>
export default {
    props: {
        existingGame: { default: function() { return false;} }
    },

    data() {
        return {
            followFormModal: false,
        }
    },

    methods: {
        showModal() {
            return true; //Diag
            if(existingGame) {
                return false;
            }
        }

        // require axios
        // follow game -> if 200 set flag to client mode, subscribe to channel

        // features to leave game, Main app must disable pushing in client mode.
        // at least 5 hours more work for this feature
    }
}
</script>

<style lang="scss">
    .follow-modal {
        input {
            text-transform: uppercase;
        }

        .actions {
            display: flex;
            flex-direction: row-reverse;
            justify-content: space-around;
        }
    }
</style>