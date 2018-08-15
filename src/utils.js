export const hasStruckOut = player => player.strikes >= 3

export const addPlayer = ({name, listOfPlayers}) => {
  if(!name) {
      return;
  }

  listOfPlayers.push({
      name: name,
      score: 0,
      turns: [], //history of scores
      strikes: 0,
      position: 1  //everyone's a winner, until they're not
  });
}
