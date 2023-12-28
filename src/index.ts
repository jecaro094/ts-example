// Some dummy code

let a = 1 + 2 
let b = a + 3 
let c = {
    apple: a,
    banana: b }

let d = c.apple * 4


// Function to get the max and min out of a string of numeric values
class Kata {
    static highAndLow(numbers: string): string {
      const numbers_array: string[] = numbers.split(' ')
      const numbers_array_n =  numbers_array.map((str) => parseInt(str, 10))
      const max_min_num = [Math.max(...numbers_array_n), Math.min(...numbers_array_n)]
      const output_string = String(max_min_num.map((num) => String(num)))
      return output_string.replace(',', ' ')
    }
  }

// let res = Kata.highAndLow('2 3 4 5')
// console.log(res)

//

function number(busStops: [number, number][]): number {
  // Your Code
  let sum = 0
  busStops.map((inOutBus) => inOutBus[0]-inOutBus[1]).map((x) => sum += x)
  return sum
}
// const ans = number([[10,0],[3,5],[5,8]])
// console.log(ans)

// Ideal answer:
// export function number(busStops:number[][]):number {
//   return busStops.reduce((rem, [on, off]) => rem+(on-off), 0);
// }


// Some kata example
function duplicateEncode(word: string){
  return word
  .toLowerCase()
  .split('')
  .map((a, i, w) => {
    return w.indexOf(a) == w.lastIndexOf(a) ? '(' : ')'
  })
  .join('');
}

// const res = duplicateEncode('sdfsgdsg')
// console.log(res)


  function binaryArrayToNumber(arr: number[]): number{
  return arr.reverse().reduce((acc, num, i) => {
    return num !== 0 ? acc + (2**i) : acc + 0
  }
  , 0);
};

// const res = binaryArrayToNumber([1, 1, 1, 1])
// console.log(res)

/////////////////////////////////////////////////////////////////////////////////////////////

// CHESS GAME
// Classes for pieces, position, and game

type Color = 'White' | 'Black'

type File_ = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' 
type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8


class Position {
  constructor(
    private file: File_,
    private rank: Rank,
  ) {}
  distanceFrom(position: Position) {
    return {
      rank: Math.abs(position.rank - this.rank),
      file: Math.abs(position.file.charCodeAt(0) - this.file.charCodeAt(0))
    }
  }
}

abstract class Piece{
  protected position: Position
  constructor(
    protected readonly color: Color,
    file: File_,
    rank: Rank
  ){
    this.position = new Position(file, rank)
  }
  moveTo(position: Position): void {
    if (this.canMoveTo(position)){
      this.position = position
    }
    else{
      console.log(`Piece cannot move to position specified`)
    }
  }
  abstract canMoveTo(position: Position): boolean
}


class King extends Piece {
  canMoveTo(position: Position) {
    let distance = this.position.distanceFrom(position)
    return distance.rank < 2 && distance.file < 2
  }
}

class Queen extends Piece {
  canMoveTo(position: Position) {
    return this.position.distanceFrom(position).file === 0 || 
      this.position.distanceFrom(position).rank === 0 ||
      this.position.distanceFrom(position).rank === this.position.distanceFrom(position).file
  }
}

class Rook extends Piece {
  canMoveTo(position: Position) {
    return this.position.distanceFrom(position).file === 0 || 
      this.position.distanceFrom(position).rank === 0 
  }
}

class Bishop extends Piece {
  canMoveTo(position: Position) {
    return this.position.distanceFrom(position).rank === this.position.distanceFrom(position).file
  }
}

// class Pawn extends Piece {
//   canMoveTo(position: Position) {
//     if (this.color === 'Black'){
//       return this.position.distanceFrom(position).file === 0 && 
//     }
//     if (this.color === 'White'){
//       return this.position.distanceFrom(position).file === 0 && 
//     }
//   }
// }


class Game {
  private pieces = Game.makePieces()
  private static makePieces() {
    return [
  // Kings
      new King('White', 'E', 1),
      new King('Black', 'E', 8),
  // Queens
      new Queen('White', 'D', 1),
      new Queen('Black', 'D', 8),
  // Bishops
      new Bishop('White', 'C', 1),
      new Bishop('White', 'F', 1),
      new Bishop('Black', 'C', 8),
      new Bishop('Black', 'F', 8),
    ]
  } 


  movePiece(pieceIndexOnBoard: number, targetPosition: Position): void{
    this.pieces[pieceIndexOnBoard].moveTo(targetPosition)
  }
  getBoardPieces(){
    return this.pieces
  }
}

const g = new Game()
console.log(g.getBoardPieces())
g.movePiece(0, new Position('A', 1))
console.log(g.getBoardPieces())