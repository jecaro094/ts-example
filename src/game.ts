const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const canvasContext = canvas.getContext("2d") as CanvasRenderingContext2D;
const pacmanFrames = document.getElementById("animation") as HTMLImageElement;
const ghostFrames = document.getElementById("ghosts") as HTMLImageElement;

class Ghost {
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
    direction: number;
    imageX: number;
    imageY: number;
    imageWidth: number;
    imageHeight: number;
    range: number;
    randomTargetIndex: number;
    target: any; // Replace 'any' with the appropriate type for 'target'

    constructor(
        x: number,
        y: number,
        width: number,
        height: number,
        speed: number,
        imageX: number,
        imageY: number,
        imageWidth: number,
        imageHeight: number,
        range: number
    ) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.direction = DIRECTION_RIGHT;
        this.imageX = imageX;
        this.imageY = imageY;
        this.imageHeight = imageHeight;
        this.imageWidth = imageWidth;
        this.range = range;
        this.randomTargetIndex = Math.floor(Math.random() * 4);
        this.target = randomTargetsForGhosts[this.randomTargetIndex];
        setInterval(() => {
            this.changeRandomDirection();
        }, 10000);
    }


    isInRange(): boolean {
        var xDistance = Math.abs(pacman.getMapX() - this.getMapX());
        let yDistance = Math.abs(pacman.getMapY() - this.getMapY());
        return Math.sqrt(xDistance * xDistance + yDistance * yDistance) <= this.range;
    }

    changeRandomDirection(): void {
        let addition = 1;
        this.randomTargetIndex += addition;
        this.randomTargetIndex = this.randomTargetIndex % 4;
    }

    moveProcess(): void {
        if (this.isInRange()) {
            this.target = pacman;
        } else {
            this.target = randomTargetsForGhosts[this.randomTargetIndex];
        }
        this.changeDirectionIfPossible();
        this.moveForwards();
        if (this.checkCollisions()) {
            this.moveBackwards();
            return;
        }
    }

    moveBackwards(): void {
        switch (this.direction) {
            case 4: // Right
                this.x -= this.speed;
                break;
            case 3: // Up
                this.y += this.speed;
                break;
            case 2: // Left
                this.x += this.speed;
                break;
            case 1: // Bottom
                this.y -= this.speed;
                break;
        }
    }

    moveForwards(): void {
        switch (this.direction) {
            case 4: // Right
                this.x += this.speed;
                break;
            case 3: // Up
                this.y -= this.speed;
                break;
            case 2: // Left
                this.x -= this.speed;
                break;
            case 1: // Bottom
                this.y += this.speed;
                break;
        }
    }

    checkCollisions(): boolean {
        // return (
        //     map[(this.y / oneBlockSize)][(this.x / oneBlockSize)] == 1 ||
        //     map[(this.y / oneBlockSize + 0.9999)][(this.x / oneBlockSize)] == 1 ||
        //     map[(this.y / oneBlockSize)][(this.x / oneBlockSize + 0.9999)] == 1 ||
        //     map[(this.y / oneBlockSize + 0.9999)][(this.x / oneBlockSize + 0.9999)] == 1
        // );
        return true;
    }

    changeDirectionIfPossible(): void {
        let tempDirection = this.direction;
        this.direction = this.calculateNewDirection(
            map,
            (this.target.x / oneBlockSize),
            (this.target.y / oneBlockSize)
        );
        if (typeof this.direction === "undefined") {
            this.direction = tempDirection;
            return;
        }
        if (
            this.getMapY() != this.getMapYRightSide() &&
            (this.direction === DIRECTION_LEFT || this.direction === DIRECTION_RIGHT)
        ) {
            this.direction = DIRECTION_UP;
        }
        if (this.getMapX() != this.getMapXRightSide() && this.direction === DIRECTION_UP) {
            this.direction = DIRECTION_LEFT;
        }
        this.moveForwards();
        if (this.checkCollisions()) {
            this.moveBackwards();
            this.direction = tempDirection;
        } else {
            this.moveBackwards();
        }
        console.log(this.direction);
    }

    calculateNewDirection(map: number[][], destX: number, destY: number): number {
        let mp: number[][] = [];
        for (let i = 0; i < map.length; i++) {
            mp[i] = map[i].slice();
        }

        let queue = [
            {
                x: this.getMapX(),
                y: this.getMapY(),
                rightX: this.getMapXRightSide(),
                rightY: this.getMapYRightSide(),
                moves: [],
            },
        ];
        while (queue.length > 0) {
            let popped: any = queue.shift();
            if (popped.x == destX && popped.y == destY) {
                return popped.moves[0];
            } else {
                mp[popped.y][popped.x] = 1;
                let neighborList = this.addNeighbors(popped, mp);
                for (let i = 0; i < neighborList.length; i++) {
                    queue.push(neighborList[i]);
                }
            }
        }

        return 1; // direction
    }

    addNeighbors(popped: any, mp: number[][]): any[] {
        let queue: any[] = [];
        let numOfRows = mp.length;
        let numOfColumns = mp[0].length;

        if (
            popped.x - 1 >= 0 &&
            popped.x - 1 < numOfRows &&
            mp[popped.y][popped.x - 1] != 1
        ) {
            let tempMoves = popped.moves.slice();
            tempMoves.push(DIRECTION_LEFT);
            queue.push({ x: popped.x - 1, y: popped.y, moves: tempMoves });
        }
        if (
            popped.x + 1 >= 0 &&
            popped.x + 1 < numOfRows &&
            mp[popped.y][popped.x + 1] != 1
        ) {
            let tempMoves = popped.moves.slice();
            tempMoves.push(DIRECTION_RIGHT);
            queue.push({ x: popped.x + 1, y: popped.y, moves: tempMoves });
        }
        if (
            popped.y - 1 >= 0 &&
            popped.y - 1 < numOfColumns &&
            mp[popped.y - 1][popped.x] != 1
        ) {
            let tempMoves = popped.moves.slice();
            tempMoves.push(DIRECTION_UP);
            queue.push({ x: popped.x, y: popped.y - 1, moves: tempMoves });
        }
        if (
            popped.y + 1 >= 0 &&
            popped.y + 1 < numOfColumns &&
            mp[popped.y + 1][popped.x] != 1
        ) {
            let tempMoves = popped.moves.slice();
            tempMoves.push(DIRECTION_BOTTOM);
            queue.push({ x: popped.x, y: popped.y + 1, moves: tempMoves });
        }
        return queue;
    }

    getMapX(): number {
        let mapX = (this.x / oneBlockSize);
        return mapX;
    }

    getMapY(): number {
        let mapY = (this.y / oneBlockSize);
        return mapY;
    }

    getMapXRightSide(): number {
        let mapX = ((this.x * 0.99 + oneBlockSize) / oneBlockSize);
        return mapX;
    }

    getMapYRightSide(): number {
        let mapY = ((this.y * 0.99 + oneBlockSize) / oneBlockSize);
        return mapY;
    }

    changeAnimation(): void {
        pacman.currentFrame = pacman.currentFrame === pacman.frameCount ? 1 : pacman.currentFrame + 1;
    }

    draw(): void {
        if (canvasContext !== null) {
            canvasContext.save();
            canvasContext.drawImage(
                ghostFrames,
                this.imageX,
                this.imageY,
                this.imageWidth,
                this.imageHeight,
                this.x,
                this.y,
                this.width,
                this.height
            );
            canvasContext.restore();
            canvasContext.beginPath();
            canvasContext.strokeStyle = "red";
            canvasContext.arc(
                this.x + oneBlockSize / 2,
                this.y + oneBlockSize / 2,
                this.range * oneBlockSize,
                0,
                2 * Math.PI
            );
            canvasContext.stroke();
        }
    }
}

let updateGhosts = (): void => {
    for (let i = 0; i < ghosts.length; i++) {
        ghosts[i].moveProcess();
    }
};

let drawGhosts = (): void => {
    for (let i = 0; i < ghosts.length; i++) {
        ghosts[i].draw();
    }
};


class Pacman {
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
    direction: number;
    nextDirection: number;
    frameCount: number;
    currentFrame: number;

    constructor(x: number, y: number, width: number, height: number, speed: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.direction = 4;
        this.nextDirection = 4;
        this.frameCount = 7;
        this.currentFrame = 1;

        setInterval(() => {
            this.changeAnimation();
        }, 100);
    }

    moveProcess(): void {
        this.changeDirectionIfPossible();
        this.moveForwards();
        if (this.checkCollisions()) {
            this.moveBackwards();
            return;
        }
    }

    eat(): void {
        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[0].length; j++) {
                if (map[i][j] == 2 && this.getMapX() == j && this.getMapY() == i) {
                    map[i][j] = 3;
                    score++;
                }
            }
        }
    }

    moveBackwards(): void {
        switch (this.direction) {
            case DIRECTION_RIGHT:
                this.x -= this.speed;
                break;
            case DIRECTION_UP:
                this.y += this.speed;
                break;
            case DIRECTION_LEFT:
                this.x += this.speed;
                break;
            case DIRECTION_BOTTOM:
                this.y -= this.speed;
                break;
        }
    }

    moveForwards(): void {
        switch (this.direction) {
            case DIRECTION_RIGHT:
                this.x += this.speed;
                break;
            case DIRECTION_UP:
                this.y -= this.speed;
                break;
            case DIRECTION_LEFT:
                this.x -= this.speed;
                break;
            case DIRECTION_BOTTOM:
                this.y += this.speed;
                break;
        }
    }

    checkCollisions(): boolean {
        let isCollided = false;
        if (
            map[parseInt(String(this.y / oneBlockSize))][parseInt(String(this.x / oneBlockSize))] == 1 ||
            map[parseInt(String(this.y / oneBlockSize + 0.9999))][parseInt(String(this.x / oneBlockSize))] == 1 ||
            map[parseInt(String(this.y / oneBlockSize))][parseInt(String(this.x / oneBlockSize + 0.9999))] == 1 ||
            map[parseInt(String(this.y / oneBlockSize + 0.9999))][parseInt(String(this.x / oneBlockSize + 0.9999))] == 1
        ) {
            isCollided = true;
        }
        return isCollided;
    }

    checkGhostCollision(ghosts: Ghost[]): boolean {
        for (let i = 0; i < ghosts.length; i++) {
            let ghost = ghosts[i];
            if (ghost.getMapX() == this.getMapX() && ghost.getMapY() == this.getMapY()) {
                return true;
            }
        }
        return false;
    }

    changeDirectionIfPossible(): void {
        if (this.direction == this.nextDirection) return;
        let tempDirection = this.direction;
        this.direction = this.nextDirection;
        this.moveForwards();
        if (this.checkCollisions()) {
            this.moveBackwards();
            this.direction = tempDirection;
        } else {
            this.moveBackwards();
        }
    }

    getMapX(): number {
        let mapX = (this.x / oneBlockSize);
        return mapX;
    }

    getMapY(): number {
        let mapY = (this.y / oneBlockSize);
        return mapY;
    }

    getMapXRightSide(): number {
        let mapX = ((this.x * 0.99 + oneBlockSize) / oneBlockSize);
        return mapX;
    }

    getMapYRightSide(): number {
        let mapY = ((this.y * 0.99 + oneBlockSize) / oneBlockSize);
        return mapY;
    }

    changeAnimation(): void {
        this.currentFrame = this.currentFrame == this.frameCount ? 1 : this.currentFrame + 1;
    }

    draw(): void {
        if (canvasContext !== null){
            canvasContext.save();
            canvasContext.translate(this.x + oneBlockSize / 2, this.y + oneBlockSize / 2);
            canvasContext.rotate((this.direction * 90 * Math.PI) / 180);
            canvasContext.translate(-this.x - oneBlockSize / 2, -this.y - oneBlockSize / 2);
            canvasContext.drawImage(
                pacmanFrames,
                (this.currentFrame - 1) * oneBlockSize,
                0,
                oneBlockSize,
                oneBlockSize,
                this.x,
                this.y,
                this.width,
                this.height
            );
            canvasContext.restore();
        }
    }
}


let createRect = (x: number, y: number, width: number, height: number, color: string) => {
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x, y, width, height);
};

const DIRECTION_RIGHT = 4;
const DIRECTION_UP = 3;
const DIRECTION_LEFT = 2;
const DIRECTION_BOTTOM = 1;
let lives = 3;
let ghostCount = 4;
let ghostImageLocations = [
    { x: 0, y: 0 },
    { x: 176, y: 0 },
    { x: 0, y: 121 },
    { x: 176, y: 121 },
];

let fps = 30;
let pacman: Pacman;
let oneBlockSize = 20;
let score = 0;
let ghosts: Ghost[] = [];
let wallSpaceWidth = oneBlockSize / 1.6;
let wallOffset = (oneBlockSize - wallSpaceWidth) / 2;
let wallInnerColor = "black";

// we now create the map of the walls,
// if 1 wall, if 0 not wall
// 21 columns // 23 rows
let map: number[][] = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
    [1, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

let randomTargetsForGhosts = [
    { x: 1 * oneBlockSize, y: 1 * oneBlockSize },
    { x: 1 * oneBlockSize, y: (map.length - 2) * oneBlockSize },
    { x: (map[0].length - 2) * oneBlockSize, y: oneBlockSize },
    {
        x: (map[0].length - 2) * oneBlockSize,
        y: (map.length - 2) * oneBlockSize,
    },
];

// for (let i = 0; i < map.length; i++) {
//     for (let j = 0; j < map[0].length; j++) {
//         map[i][j] = 2;
//     }
// }

let createNewPacman = () => {
    pacman = new Pacman(
        oneBlockSize,
        oneBlockSize,
        oneBlockSize,
        oneBlockSize,
        oneBlockSize / 5
    );
};

let gameLoop = () => {
    update();
    draw();
};

let gameInterval = setInterval(gameLoop, 1000 / fps);

let restartPacmanAndGhosts = () => {
    createNewPacman();
    createGhosts();
};

let onGhostCollision = () => {
    lives--;
    restartPacmanAndGhosts();
    if (lives == 0) {
    }
};

let update = () => {
    pacman.moveProcess();
    pacman.eat();
    updateGhosts();
    if (pacman.checkGhostCollision(ghosts)) {
        onGhostCollision();
    }
};

let drawFoods = () => {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            if (map[i][j] == 2) {
                createRect(
                    j * oneBlockSize + oneBlockSize / 3,
                    i * oneBlockSize + oneBlockSize / 3,
                    oneBlockSize / 3,
                    oneBlockSize / 3,
                    "#FEB897"
                );
            }
        }
    }
};

let drawRemainingLives = () => {
    canvasContext.font = "20px Emulogic";
    canvasContext.fillStyle = "white";
    canvasContext.fillText("Lives: ", 220, oneBlockSize * (map.length + 1));

    for (let i = 0; i < lives; i++) {
        canvasContext.drawImage(
            pacmanFrames,
            2 * oneBlockSize,
            0,
            oneBlockSize,
            oneBlockSize,
            350 + i * oneBlockSize,
            oneBlockSize * map.length + 2,
            oneBlockSize,
            oneBlockSize
        );
    }
};

let drawScore = () => {
    canvasContext.font = "20px Emulogic";
    canvasContext.fillStyle = "white";
    canvasContext.fillText(
        "Score: " + score,
        0,
        oneBlockSize * (map.length + 1)
    );
};

let draw = () => {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    createRect(0, 0, canvas.width, canvas.height, "black");
    drawWalls();
    drawFoods();
    drawGhosts();
    pacman.draw();
    drawScore();
    drawRemainingLives();
};

let drawWalls = () => {
    const wallColor = "#370DD8";
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            if (map[i][j] == 1) {
                createRect(
                    j * oneBlockSize,
                    i * oneBlockSize,
                    oneBlockSize,
                    oneBlockSize,
                    wallColor
                );
                if (j > 0 && map[i][j - 1] == 1) {
                    createRect(
                        j * oneBlockSize,
                        i * oneBlockSize + wallOffset,
                        wallSpaceWidth + wallOffset,
                        wallSpaceWidth,
                        wallInnerColor
                    );
                }

                if (j < map[0].length - 1 && map[i][j + 1] == 1) {
                    createRect(
                        j * oneBlockSize + wallOffset,
                        i * oneBlockSize + wallOffset,
                        wallSpaceWidth + wallOffset,
                        wallSpaceWidth,
                        wallInnerColor
                    );
                }

                if (i < map.length - 1 && map[i + 1][j] == 1) {
                    createRect(
                        j * oneBlockSize + wallOffset,
                        i * oneBlockSize + wallOffset,
                        wallSpaceWidth,
                        wallSpaceWidth + wallOffset,
                        wallInnerColor
                    );
                }

                if (i > 0 && map[i - 1][j] == 1) {
                    createRect(
                        j * oneBlockSize + wallOffset,
                        i * oneBlockSize,
                        wallSpaceWidth,
                        wallSpaceWidth + wallOffset,
                        wallInnerColor
                    );
                }
            }
        }
    }
};

let createGhosts = () => {
    ghosts = [];
    for (let i = 0; i < ghostCount * 2; i++) {
        let newGhost = new Ghost(
            9 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
            10 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
            oneBlockSize,
            oneBlockSize,
            pacman.speed / 2,
            ghostImageLocations[i % 4].x,
            ghostImageLocations[i % 4].y,
            124,
            116,
            6 + i
        );
        ghosts.push(newGhost);
    }
};

createNewPacman();
createGhosts();
gameLoop();

window.addEventListener("keydown", (event) => {
    let k = event.keyCode;
    setTimeout(() => {
        if (k == 37 || k == 65) {
            // left arrow or a
            pacman.nextDirection = DIRECTION_LEFT;
        } else if (k == 38 || k == 87) {
            // up arrow or w
            pacman.nextDirection = DIRECTION_UP;
        } else if (k == 39 || k == 68) {
            // right arrow or d
            pacman.nextDirection = DIRECTION_RIGHT;
        } else if (k == 40 || k == 83) {
            // bottom arrow or s
            pacman.nextDirection = DIRECTION_BOTTOM;
        }
    }, 1);
});