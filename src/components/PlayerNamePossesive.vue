<template>
  <span>{{ playerNamePossesive }}</span>
</template>

<script>
  export default {
    name: 'PlayerNamePossesive',
    props: {
      name: {
        type: String,
        required: true
      }
    },
    computed: {
      playerNamePossesive() {
        const name = this.name;
        const endsInS = name.substr(-1) === 's';
        return `${name}'${endsInS ? '' : 's'}`
      }
    }
  }
</script>
