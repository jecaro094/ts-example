"use strict";
// Some dummy code
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var a = 1 + 2;
var b = a + 3;
var c = {
    apple: a,
    banana: b
};
var d = c.apple * 4;
// Function to get the max and min out of a string of numeric values
var Kata = /** @class */ (function () {
    function Kata() {
    }
    Kata.highAndLow = function (numbers) {
        var numbers_array = numbers.split(' ');
        var numbers_array_n = numbers_array.map(function (str) { return parseInt(str, 10); });
        var max_min_num = [Math.max.apply(Math, numbers_array_n), Math.min.apply(Math, numbers_array_n)];
        var output_string = String(max_min_num.map(function (num) { return String(num); }));
        return output_string.replace(',', ' ');
    };
    return Kata;
}());
// let res = Kata.highAndLow('2 3 4 5')
// console.log(res)
//
function number(busStops) {
    // Your Code
    var sum = 0;
    busStops.map(function (inOutBus) { return inOutBus[0] - inOutBus[1]; }).map(function (x) { return sum += x; });
    return sum;
}
// const ans = number([[10,0],[3,5],[5,8]])
// console.log(ans)
// Ideal answer:
// export function number(busStops:number[][]):number {
//   return busStops.reduce((rem, [on, off]) => rem+(on-off), 0);
// }
// Some kata example
function duplicateEncode(word) {
    return word
        .toLowerCase()
        .split('')
        .map(function (a, i, w) {
        return w.indexOf(a) == w.lastIndexOf(a) ? '(' : ')';
    })
        .join('');
}
// const res = duplicateEncode('sdfsgdsg')
// console.log(res)
function binaryArrayToNumber(arr) {
    return arr.reverse().reduce(function (acc, num, i) {
        return num !== 0 ? acc + (Math.pow(2, i)) : acc + 0;
    }, 0);
}
;
var Position = /** @class */ (function () {
    function Position(file, rank) {
        this.file = file;
        this.rank = rank;
    }
    Position.prototype.distanceFrom = function (position) {
        return {
            rank: Math.abs(position.rank - this.rank),
            file: Math.abs(position.file.charCodeAt(0) - this.file.charCodeAt(0))
        };
    };
    return Position;
}());
var Piece = /** @class */ (function () {
    function Piece(color, file, rank) {
        this.color = color;
        this.position = new Position(file, rank);
    }
    Piece.prototype.moveTo = function (position) {
        if (this.canMoveTo(position)) {
            this.position = position;
        }
        else {
            console.log("Piece cannot move to position specified");
        }
    };
    return Piece;
}());
var King = /** @class */ (function (_super) {
    __extends(King, _super);
    function King() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    King.prototype.canMoveTo = function (position) {
        var distance = this.position.distanceFrom(position);
        return distance.rank < 2 && distance.file < 2;
    };
    return King;
}(Piece));
var Queen = /** @class */ (function (_super) {
    __extends(Queen, _super);
    function Queen() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Queen.prototype.canMoveTo = function (position) {
        return this.position.distanceFrom(position).file === 0 ||
            this.position.distanceFrom(position).rank === 0 ||
            this.position.distanceFrom(position).rank === this.position.distanceFrom(position).file;
    };
    return Queen;
}(Piece));
var Rook = /** @class */ (function (_super) {
    __extends(Rook, _super);
    function Rook() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rook.prototype.canMoveTo = function (position) {
        return this.position.distanceFrom(position).file === 0 ||
            this.position.distanceFrom(position).rank === 0;
    };
    return Rook;
}(Piece));
var Bishop = /** @class */ (function (_super) {
    __extends(Bishop, _super);
    function Bishop() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Bishop.prototype.canMoveTo = function (position) {
        return this.position.distanceFrom(position).rank === this.position.distanceFrom(position).file;
    };
    return Bishop;
}(Piece));
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
var Game = /** @class */ (function () {
    function Game() {
        this.pieces = Game.makePieces();
    }
    Game.makePieces = function () {
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
        ];
    };
    Game.prototype.movePiece = function (pieceIndexOnBoard, targetPosition) {
        this.pieces[pieceIndexOnBoard].moveTo(targetPosition);
    };
    Game.prototype.getBoardPieces = function () {
        return this.pieces;
    };
    return Game;
}());
var g = new Game();
console.log(g.getBoardPieces());
g.movePiece(0, new Position('A', 1));
console.log(g.getBoardPieces());
