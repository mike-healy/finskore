<template>
    <div class="arrangement" @click="$emit('hide')">
        <img src="img/arrangement.svg" alt="Arrangement">

        <button class="cancel">Close</button>
    </div>
</template>

<script>
export default {
    //props: ['showArrangementGuide'],
}
</script>

<style lang="scss">
div.arrangement {
    margin: 2rem 0;
    text-align: center;

    img {
        display: block;
        margin: 0 auto;
        width: 100%;
        max-width: 300px;
        cursor: pointer;
    }
}
</style>