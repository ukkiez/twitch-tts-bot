const getBop = ( data ) => {
  const { ranks_scores, ranks_times } = data;

  const boppableRank = {
    ss: undefined,
    anypercent: undefined,
  }
  const mostBoppableRanks = {
    ss: [],
    anypercent: [],
  }
  for ( const { rank, level, levelname } of Object.values( ranks_scores ) ) {
    if ( rank === 9 ) {
      boppableRank.ss = { rank, level, levelname };
      break;
    }

    if ( rank > 9 ) {
      continue;
    }

    if ( rank <= 9 ) {
      mostBoppableRanks.ss.push( { rank, level, levelname } );
    }
  }
  for ( const { level, levelname, rank } of Object.values( ranks_times ) ) {
    if ( rank === 9 ) {
      boppableRank.anypercent = { rank, level, levelname };
      break;
    }

    if ( rank > 9 ) {
      continue;
    }

    if ( rank <= 9 ) {
      mostBoppableRanks.anypercent.push( { rank, level, levelname } );
    }
  }

  if ( !boppableRank.ss && mostBoppableRanks.ss.length ) {
    boppableRank.ss = mostBoppableRanks.ss.sort( ( a, b ) => b.rank-a.rank )[ 0 ];
  }
  if ( !boppableRank.anypercent && mostBoppableRanks.anypercent.length ) {
    boppableRank.anypercent = mostBoppableRanks.anypercent.sort( ( a, b ) => b.rank-a.rank )[ 0 ];
  }

  return boppableRank;
}

module.exports = getBop;
