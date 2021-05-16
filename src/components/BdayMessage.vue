<template>
  <div v-if="bday" class="bday-box">
      <p>Happy Birthday {{bday}}</p>
  </div>
</template>

<script>
export default {
    props: {
        bday: {
            type: String,
            default: () => ''
        }
    }
}
</script>

<style lang="scss">
div.bday-box {
    background: linear-gradient(45deg, #5b2961, #e05959,#f1d983);
    padding: 0.5rem 1rem;
    margin-top: 2rem;
    border-radius: 8px;
    text-align: center;
    color: #fff;
    text-shadow: -4px 4px 2px #2f2c628a;
    box-shadow: -8px 8px 4px rgba(0,0,0,0.2), -4px 4px 1px rgba(170,70,180,0.3);
    border-bottom: 1px solid #e8c153;

    p {
        font-size: 1.5rem;
        font-weight: bold;
        font-family: 'Kalam', cursive;
        margin: 0;
    }
}

@media screen and (min-width: 768px) {
    div.bday-box {
        padding: 1.5rem;

        p {
            font-size: 2rem;
        }
    }
}
</style>