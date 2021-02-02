<template>
  <section class="leaderboard">
    <div v-for="(player, index) in players"
      :key="index"
      @click="$emit('selectPlayer', player)"
      class="player"
      v-bind:class="{
        struckout: hasStruckOut(player),
        myturn: currentTurnPlayerId === index,
        winning: player.position === 1
      }"
    >
      <div class='pos'>{{ showPosition(player.position) }}</div>
      <div class="player">
        <div class="name">
          {{ player.name }}
          <img v-show="player.theyBlewIt" src="img/sad.png" alt="sad face">
        </div>
        <div class="strikes">{{ showStrikes(player) }}</div>
      </div>
      <div class="score">{{ player.score }}</div>
      <div class="togo" :class="{'within-range': playToScore-player.score <= 12}">{{ playToScore - player.score }}</div>
    </div>
  </section>
</template>

<script>
  import { hasStruckOut } from '../Finskore';

  export default {
    name: 'Leaderboard',
    methods: {
      showStrikes(player) {

        let consecStrikes = player.turns.reduce(
            //(strikeCount, score) => (score === 0) ? strikeCount+1 : 0
            function(strikeCount, score) {
                if(strikeCount >= 3) {
                    return strikeCount; //if it EVER reached 3 strikes, still out
                }
                if(score === 0) {
                    return strikeCount+1;
                }
                return 0;
            }
        , 0);
        
        player.strikes = consecStrikes;

        let str = '';
        if (consecStrikes === 0) {
            return str;
        }

        for (let i=0; i<consecStrikes; i++) {
            str += 'x ';
        }
        return str;
      },

      hasStruckOut,

      // English-ify the numeric position
      showPosition(p) {
          // 1st, 2nd, 3rd, 4th, 5th,
          if (p >= 4) {
              return p + 'th';
          }
          switch(p) {
              case 0:
                  return ' '; //when first turn is a miss there are no positions
                  break;
              case 1:
                  return '1st';
                  break;
              case 2:
                  return '2nd';
                  break;
              default:
                  return p + 'rd';
                  break;
          }
      },
    },
    props: {
      players: { required: true, type: Array },
      currentTurnPlayerId: { required: true, type: Number },
      playToScore: { required: true, type: Number },
    }
  }
</script>

<style lang="scss">
  .christmas section.leaderboard {
      background: rgba(6, 29, 15, 0.78);
  }
  
  section.leaderboard > div.player {
      display: flex;
  }

  section.leaderboard > div {
      border-bottom: 1px solid #64bf64;
  }

  .player > div {
      padding: 1rem;
  }

  .player.myturn {
      background: #1b5f6b
  }
  .player.winning .pos{
      background: #134a61;
  }

  .player .player {
      flex-grow: 2;
  }
  .player .pos,
  .player .score,
  .player .togo {
      flex-shrink: 1;
      min-width: 3rem;
      text-align: right;
  }

  //Within range of winning
  .player .togo.within-range {
    text-decoration: underline;
    text-underline-position: under;
  }
  .player.myturn .togo {
    opacity: 0.8;
  }


  .player .score {
      font-weight: bold;
  }
  .player .togo {
      opacity: 0.6;
  }

  .player .name,
  .player .strikes {
      padding: 0 0 0.2rem 0;
  }

  .player .name {
      cursor: pointer;
  }
  .player .name img {
      display: block;
      margin-top: 4px;
      width: 32px;
      height: auto;
      border: none;
  }

  .struckout {
      text-decoration: line-through;
      color: #a7d5ef;
  }
</style>
