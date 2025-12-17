type Mark = "X" | "O";
type Cell = Mark | "";
type Board = readonly (readonly Cell[])[];
type Status = "finished" | "in_progress" | "pending";
type ValidRowCol = 0 | 1 | 2;
type WinningLine = readonly [ValidRowCol, ValidRowCol][] | null;

type GameResult = {
  isTie: boolean;
  winningLine: WinningLine;
  winningMark: Mark | null;
};

type GameState = {
  board: Board;
  currentMark: Mark;
  enableWarnings: boolean;
  status: Status;
  tied: boolean;
  winningLine: WinningLine;
  winningMark: Mark | null;
};

class TicTacToe {
  private static readonly winnerPositions: readonly (readonly [
    ValidRowCol,
    ValidRowCol,
  ][])[] = [
    // Rows
    [
      [0, 0],
      [0, 1],
      [0, 2],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 2],
    ],
    [
      [2, 0],
      [2, 1],
      [2, 2],
    ],
    // Columns
    [
      [0, 0],
      [1, 0],
      [2, 0],
    ],
    [
      [0, 1],
      [1, 1],
      [2, 1],
    ],
    [
      [0, 2],
      [1, 2],
      [2, 2],
    ],
    // Diagonals
    [
      [0, 0],
      [1, 1],
      [2, 2],
    ],
    [
      [0, 2],
      [1, 1],
      [2, 0],
    ],
  ] as const;

  private readonly board: Board;
  private readonly currentMark: Mark;
  private readonly enableWarnings: boolean;
  private readonly status: Status;
  private readonly tied: boolean;
  private readonly winningLine: WinningLine;
  private readonly winningMark: Mark | null;

  private static isValidRowCol(value: number): value is ValidRowCol {
    return Number.isInteger(value) && value >= 0 && value <= 2;
  }

  private static switchMark(mark: Mark): Mark {
    return mark === "X" ? "O" : "X";
  }

  private constructor(state: GameState) {
    this.board = state.board;
    this.currentMark = state.currentMark;
    this.status = state.status;
    this.tied = state.tied;
    this.winningMark = state.winningMark;
    this.winningLine = state.winningLine;
    this.enableWarnings = state.enableWarnings;
  }

  /**
   * Creates a new TicTacToe game with initial state.
   * @param enableWarnings - Whether to log warnings for invalid moves (default: true)
   * @returns A new TicTacToe instance with empty board and "X" as the starting mark
   */
  static create(enableWarnings: boolean = true): TicTacToe {
    return new TicTacToe({
      board: Array.from({ length: 3 }, () =>
        Array.from({ length: 3 }, () => ""),
      ),
      currentMark: "X",
      enableWarnings,
      status: "pending",
      tied: false,
      winningLine: null,
      winningMark: null,
    });
  }

  /**
   * Checks if the current mark has won or if the game is tied.
   * @param board - The current board state
   * @param currentMark - The mark that just moved
   * @returns Object with winning line, winning mark (if any), and tie status
   */
  private checkWinnerOrTie(board: Board, currentMark: Mark): GameResult {
    // Check if any winning line has all positions matching currentMark
    const winningLine = TicTacToe.winnerPositions.find(
      (positions: readonly [ValidRowCol, ValidRowCol][]) =>
        positions.every(([row, col]: [ValidRowCol, ValidRowCol]) => {
          const boardRow = board[row];
          if (!boardRow) {
            return false;
          }
          const cell = boardRow[col];
          return cell === currentMark;
        }),
    );

    if (winningLine) {
      return { isTie: false, winningLine, winningMark: currentMark };
    }

    const isTie = board.every((row: readonly Cell[]) =>
      row.every((cell: Cell) => cell !== ""),
    );
    return { isTie, winningLine: null, winningMark: null };
  }

  /**
   * Returns a copy of the current board state.
   * @returns A readonly 3x3 2D array representing the board (empty string for empty cells, "X" or "O" for occupied cells)
   */
  getBoard(): Board {
    return this.board.map((row: readonly Cell[]) => [...row]);
  }

  /**
   * Returns the current turn's mark, or the last mark played if game is finished.
   * @returns The current mark ("X" or "O")
   */
  getCurrentMark(): Mark {
    return this.currentMark;
  }

  /**
   * Returns the current status of the game.
   * @returns The game status: "pending" (not started), "in_progress" (active game), or "finished" (game over)
   */
  getStatus(): Status {
    return this.status;
  }

  /**
   * Returns the winner of the game.
   * @returns The winning mark ("X" or "O"), or null if there is no winner yet or the game ended in a tie
   */
  getWinner(): Mark | null {
    return this.winningMark;
  }

  /**
   * Checks if the game ended in a tie.
   * @returns True if the game ended in a tie, false otherwise
   */
  isTie(): boolean {
    return this.tied;
  }

  /**
   * Returns the winning line positions if there is a winner.
   * @returns Array of [row, col] positions that form the winning line, or null if there is no winner
   */
  getWinningLine(): WinningLine {
    return this.winningLine;
  }

  /**
   * Checks if the game has finished (either by win or tie).
   * @returns True if the game is finished, false otherwise
   */
  isFinished(): boolean {
    return this.status === "finished";
  }

  /**
   * Makes a move at the specified board position.
   * @param row - The row (0-2) where to place the current mark
   * @param col - The column (0-2) where to place the current mark
   * @returns A new TicTacToe instance with the move applied, or the current instance if the move is invalid
   * @remarks
   * - Returns a new instance if the move is valid
   * - Returns the current instance (unchanged) if the game is finished, position is out of bounds, or cell is occupied
   * - Invalid moves are logged as warnings
   */
  move(row: number, col: number): TicTacToe {
    if (this.status === "finished") {
      if (this.enableWarnings) {
        console.warn("The game was over");
      }
      return this;
    }

    if (!TicTacToe.isValidRowCol(row) || !TicTacToe.isValidRowCol(col)) {
      if (this.enableWarnings) {
        console.warn(
          `Invalid move: row ${row} or col ${col} must be integers between 0-2`,
        );
      }
      return this;
    }

    const boardRow = this.board[row];
    if (!boardRow) {
      if (this.enableWarnings) {
        console.warn(`Invalid move: row ${row} does not exist`);
      }
      return this;
    }

    const cell = boardRow[col];
    if (cell === undefined) {
      if (this.enableWarnings) {
        console.warn(
          `Invalid move: cell at row ${row}, col ${col} does not exist`,
        );
      }
      return this;
    }

    if (cell !== "") {
      if (this.enableWarnings) {
        console.warn(
          `Invalid move: cell at row ${row}, col ${col} is already occupied`,
        );
      }
      return this;
    }

    const newStatus: Status =
      this.status === "pending" ? "in_progress" : this.status;

    const newBoard = this.board.map((boardRow: readonly Cell[]) => [
      ...boardRow,
    ]);
    const targetRow = newBoard[row];
    if (!targetRow) {
      if (this.enableWarnings) {
        console.warn(`Invalid move: row ${row} does not exist in new board`);
      }
      return this;
    }
    targetRow[col] = this.currentMark;

    const { isTie, winningLine, winningMark } = this.checkWinnerOrTie(
      newBoard,
      this.currentMark,
    );

    const finalStatus: Status =
      winningMark !== null || isTie ? "finished" : newStatus;
    const nextMark: Mark =
      winningMark !== null || isTie
        ? this.currentMark
        : TicTacToe.switchMark(this.currentMark);

    return new TicTacToe({
      board: newBoard,
      currentMark: nextMark,
      enableWarnings: this.enableWarnings,
      status: finalStatus,
      tied: isTie,
      winningLine,
      winningMark,
    });
  }

  /**
   * Resets the game to its initial state.
   * @returns A new TicTacToe instance with fresh initial state
   * @remarks
   * - Returns a new instance with empty board
   * - Current mark set to "X"
   * - Status set to "pending"
   * - No winner or tie
   * - Preserves the enableWarnings setting from the current instance
   */
  reset(): TicTacToe {
    return TicTacToe.create(this.enableWarnings);
  }
}

export { TicTacToe };

export type { Board, Cell, Mark, Status, WinningLine };
