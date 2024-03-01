let boardWithMoves = [1, 1, 3];

if (boardWithMoves.every(elem => elem === boardWithMoves[0])) {
  console.log('YES');
}
else {
  console.log('no');
}