import { useState } from 'react';

function Square({ value, onSquareClick, isWinningSquare }) {
  return (
    <button className= {`square ${isWinningSquare && 'winningSquare'}`} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner.winner;
  } else if (!squares.includes(null)) {
    status = 'Draw';
  }else{
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      {
        [0, 1, 2].map((row, i) => {
          return (
            <div key={i} className="board-row">
              {
                [0, 1, 2].map((col, j) => {
                  return (
                    <Square key={j} value={squares[3 * i + j]} onSquareClick={() => handleClick(3 * i + j)} isWinningSquare={winner != null && winner.line.includes(3 * i + j)} />
                  );
                })
              }
            </div>
          );
        })
      }
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [isAscending, setIsAscending] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    let row;
    let col;
    if (move > 0) {
      description = 'Go to move #' + move
      let diff = squares.findIndex((square, i) => square !== history[move - 1][i]);
      row = Math.floor(diff / 3);
      col = diff % 3;
      description += ` (${row}, ${col})`;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        {
          currentMove === move ? (`You are at move #${move} (${row},${col})`) : (<button onClick={() => jumpTo(move)}>{description}</button>)
        }
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        {
          isAscending === true ? (<button onClick={() => setIsAscending(!isAscending)}>Ascending sort</button>) : (<button onClick={() => setIsAscending(!isAscending)}>Descending  sort</button>)
        }
        <ol>{isAscending === true ? moves : moves.reverse()}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a], 
        line:lines[i]
      };
    }
  }
  return null;
}
