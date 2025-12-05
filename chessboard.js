// chessboard.js - Chessboard display implementation
function Chessboard(id, config) {
    const board = document.getElementById(id);
    const size = Math.min(400, window.innerWidth - 40);
    const squareSize = size / 8;
    let isFlipped = false;
    
    // Create board HTML
    board.style.width = `${size}px`;
    board.style.height = `${size}px`;
    board.style.display = 'grid';
    board.style.gridTemplateColumns = `repeat(8, ${squareSize}px)`;
    board.style.gridTemplateRows = `repeat(8, ${squareSize}px)`;
    board.style.border = '2px solid #333';
    
    // Create squares
    const squares = {};
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];
    
    ranks.forEach((rank, rankIndex) => {
      files.forEach((file, fileIndex) => {
        const squareId = file + rank;
        const square = document.createElement('div');
        square.id = squareId;
        square.dataset.square = squareId;
        square.style.width = `${squareSize}px`;
        square.style.height = `${squareSize}px`;
        square.style.display = 'flex';
        square.style.justifyContent = 'center';
        square.style.alignItems = 'center';
        square.style.cursor = 'pointer';
        
        // Alternate colors
        const isLight = (fileIndex + rankIndex) % 2 === 0;
        square.style.backgroundColor = isLight ? '#f0d9b5' : '#b58863';
        
        board.appendChild(square);
        squares[squareId] = square;
      });
    });
    
    // Update board position
    function updatePosition(fen) {
      // Clear all pieces
      Object.values(squares).forEach(square => {
        square.innerHTML = '';
      });
      
      // Place pieces according to FEN
      const fenParts = fen.split(' ');
      const position = fenParts[0];
      let rank = 8;
      let file = 1;
      
      for (const char of position) {
        if (char === '/') {
          rank--;
          file = 1;
        } else if (isNaN(char)) {
          const squareId = String.fromCharCode(96 + file) + rank;
          const piece = document.createElement('div');
          piece.textContent = getPieceSymbol(char);
          piece.style.fontSize = `${squareSize * 0.8}px`;
          piece.style.userSelect = 'none';
          squares[squareId].appendChild(piece);
          file++;
        } else {
          file += parseInt(char, 10);
        }
      }
      
      // Update moves display
      document.getElementById('moves-display').textContent = chess.getMoves();
    }
    
    // Helper function to get piece symbols
    function getPieceSymbol(piece) {
      const symbols = {
        'K': '♔', 'Q': '♕', 'R': '♖', 'B': '♗', 'N': '♘', 'P': '♙',
        'k': '♚', 'q': '♛', 'r': '♜', 'b': '♝', 'n': '♞', 'p': '♟'
      };
      return symbols[piece] || piece;
    }
    
    // Initialize board
    updatePosition(config.position || 'start');
    
    // Drag and drop functionality
    let dragStartSquare = null;
    
    board.addEventListener('mousedown', e => {
      const square = e.target.closest('[data-square]');
      if (square) {
        dragStartSquare = square.dataset.square;
      }
    });
    
    board.addEventListener('mouseup', e => {
      const square = e.target.closest('[data-square]');
      if (square && dragStartSquare) {
        const dragEndSquare = square.dataset.square;
        if (dragStartSquare !== dragEndSquare) {
          const result = chess.move(dragStartSquare, dragEndSquare);
          if (result.success) {
            updatePosition(result.fen);
          }
        }
        dragStartSquare = null;
      }
    });
    
    return {
      start: () => {
        const fen = chess.resetGame();
        updatePosition(fen);
      },
      position: (fen) => {
        if (chess.setPosition(fen)) {
          updatePosition(fen);
        }
      },
      flip: () => {
        isFlipped = !isFlipped;
        board.style.transform = isFlipped ? 'rotate(180deg)' : 'rotate(0deg)';
        // Flip each piece individually to keep them upright
        Object.values(squares).forEach(square => {
          square.style.transform = isFlipped ? 'rotate(180deg)' : 'rotate(0deg)';
        });
      }
    };
  }