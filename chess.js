// chess.js - Chess logic implementation
class ChessGame {
    constructor() {
      this.resetGame();
      this.moves = [];
    }
  
    resetGame() {
      this.game = new Chess();
      this.moves = [];
      return this.game.fen();
    }
  
    move(from, to) {
      try {
        const move = this.game.move({
          from: from,
          to: to,
          promotion: 'q' // always promote to queen for simplicity
        });
        
        if (move) {
          this.moves.push(move.san);
          return { success: true, fen: this.game.fen() };
        }
        return { success: false };
      } catch (e) {
        return { success: false };
      }
    }
  
    setPosition(fen) {
      try {
        this.game.load(fen);
        this.moves = [];
        return true;
      } catch (e) {
        return false;
      }
    }
  
    getMoves() {
      return this.moves.join(' - ');
    }
  }
  
  // Initialize chess.js when loaded
  const chess = new ChessGame();
  console.log('chess.js loaded');