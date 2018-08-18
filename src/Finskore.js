import uuid from 'uuid/v4';

export const hasStruckOut = player => player.strikes >= 3

export const addPlayer = ({name, players}) => {
  if(!name) {
      return;
  }

  players.push({
      id: uuid(),
      name: name,
      score: 0,
      turns: [], //history of scores
      strikes: 0,
      position: 1  //everyone's a winner, until they're not
  });

  return players;
}

export default {
  addPlayer, hasStruckOut
}
