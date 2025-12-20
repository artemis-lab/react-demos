import { Handshake, Trophy } from "lucide-react";
import { useState } from "react";

import {
  type Cell,
  TicTacToe as TicTacToeGame,
} from "../../../games/TicTacToe";

type CellPosition = { row: number; col: number };

const TicTacToe = () => {
  const [game, setGame] = useState<TicTacToeGame>(() => TicTacToeGame.create());
  const [hoveredCell, setHoveredCell] = useState<CellPosition | null>(null);

  const board = game.getBoard();
  const currentMark = game.getCurrentMark();
  const isTie = game.isTie();
  const isFinished = game.isFinished();
  const winningLine = game.getWinningLine();
  const winner = game.getWinner();

  const getCellStyles = (cell: Cell, row: number, col: number) => {
    const baseStyles =
      "h-20 w-20 text-5xl font-bold transition-all duration-300 rounded-lg shadow-md hover:shadow-lg disabled:cursor-not-allowed relative overflow-hidden";

    if (isWinningCell(row, col)) {
      return `${baseStyles} bg-green-500 text-white scale-105 animate-pulse`;
    }

    if (cell === "X") {
      return `${baseStyles} border-1 border-transparent bg-blue-100 text-blue-600 hover:bg-blue-200`;
    }

    if (cell === "O") {
      return `${baseStyles} border-1 border-transparent bg-purple-100 text-purple-600 hover:bg-purple-200`;
    }

    // Empty cell with grid lines
    return `${baseStyles} bg-gray-50 border-2 border-gray-300 border-dotted hover:bg-gray-100 hover:border-gray-400 active:bg-gray-200`;
  };

  const getStatusMessage = () => {
    if (winner) {
      return (
        <span className="flex items-center gap-2 text-lg font-bold text-green-600 sm:text-xl">
          <Trophy className="sm:h-6 sm:w-6" size={20} />
          Player {winner} wins!
        </span>
      );
    }
    if (isTie) {
      return (
        <span className="flex items-center gap-2 text-lg font-bold text-gray-600 sm:text-xl">
          <Handshake className="sm:h-6 sm:w-6" size={20} />
          It's a tie!
        </span>
      );
    }
    return (
      <span className="text-lg text-gray-700 sm:text-xl">
        Current turn:{" "}
        <span
          className={`font-bold ${currentMark === "X" ? "text-blue-600" : "text-purple-600"}`}
        >
          {currentMark}
        </span>
      </span>
    );
  };

  const handleCellClick = (row: number, col: number) => {
    if (isFinished) {
      return;
    }
    const newGame = game.move(row, col);
    setGame(newGame);
  };

  const handleReset = () => {
    setGame(game.reset());
    setHoveredCell(null);
  };

  const isWinningCell = (row: number, col: number) => {
    return winningLine?.some(([r, c]) => r === row && c === col) ?? false;
  };

  const showHoverPreview = (row: number, col: number) => {
    return (
      hoveredCell?.row === row &&
      hoveredCell?.col === col &&
      board[row]?.[col] === "" &&
      !isFinished
    );
  };

  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-white p-4 shadow-2xl sm:gap-6 sm:p-6">
        <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
          Tic Tac Toe
        </h1>

        <div className="flex w-full flex-col items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3 sm:gap-4 sm:p-4">
          <div className="text-center">{getStatusMessage()}</div>
        </div>

        <div className="flex flex-col gap-2">
          {board.map((row: readonly Cell[], rowIndex: number) => (
            <div key={rowIndex} className="flex gap-2">
              {row.map((cell: Cell, colIndex: number) => (
                <button
                  key={colIndex}
                  aria-label={`Cell ${rowIndex}-${colIndex}`}
                  className={getCellStyles(cell, rowIndex, colIndex)}
                  disabled={isFinished || cell !== ""}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  onMouseLeave={() => setHoveredCell(null)}
                  onMouseEnter={() =>
                    setHoveredCell({ row: rowIndex, col: colIndex })
                  }
                >
                  {cell}
                  {/* Hover preview */}
                  {showHoverPreview(rowIndex, colIndex) && (
                    <span
                      className={`pointer-events-none absolute inset-0 flex items-center justify-center text-5xl font-bold opacity-20 ${
                        currentMark === "X"
                          ? "text-blue-600"
                          : "text-purple-600"
                      }`}
                    >
                      {currentMark}
                    </span>
                  )}
                </button>
              ))}
            </div>
          ))}
        </div>

        <button
          className="w-full rounded-lg bg-linear-to-r from-blue-500 to-purple-500 px-8 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95"
          onClick={handleReset}
        >
          New Game
        </button>
      </div>
    </div>
  );
};

export default TicTacToe;
