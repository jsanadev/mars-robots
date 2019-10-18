class RobotsService {
    constructor(payload) {
        this.blockedCoords = [];
        this.currentRobotIsOff = false; 
        this.results = [];
        this.deployCurrentRobotsIteration(payload);
    }
    getResults() {
        return this.results;
    }
    deployCurrentRobotsIteration(payload) {
        const [ maxX, maxY ] = Array.from(...payload.slice(0, 1));
        this.maxX = maxX;
        this.maxY = maxY;
        this.instructions = payload.slice(1);
        const generatedResults = this.generateResults(this.instructions);
        for (let result of generatedResults) {
            this.results.push(result);
        }
    }
    * generateResults(instructions) {
       for(let instruction of instructions) {
            const [ startPoint, movements ] = instruction.trim().split(" ");
            let x = Number(startPoint[0]);
            let y = Number(startPoint[1]);
            let o = startPoint[2];
            const areNumbers = !isNaN(x) && !isNaN(y);
            if (areNumbers && this.canBeInteracted(x, y, movements)) {
                yield this.robotInteraction(x, y, o, movements);
            }
       }
    }
    canBeInteracted(x, y, movements) {
        const ok_x = x <= 50 && x >= 0 && x <= this.maxX;
        const ok_y = y <= 50 && y >= 0 && y <= this.maxY;
        return ok_x && ok_y && movements.length <= 100;
    }
    robotInteraction(x, y, o, movements) {
        this.currentRobotIsOff = false; 
        const actions = {
            N: {
                R: "E",
                L: "W",
                F: currentPos => {
                    const newVal = y + 1;
                    const newPos = [x, newVal, o].toString();
                    y = this.move(newPos, currentPos, newVal, y, this.maxY);
                }
            },
            S: {
                R: "W",
                L: "E",
                F: currentPos => {
                    const newVal = y - 1;
                    const newPos = [x, newVal, o].toString();
                    y = this.move(newPos, currentPos, newVal, y, this.maxY);
                }
            },
            E: {
                R: "S",
                L: "N",
                F: currentPos => {
                    const newVal = x + 1;
                    const newPos = [newVal, y, o].toString();
                    x = this.move(newPos, currentPos, newVal, x, this.maxX);
                }
            },
            W: {
                R: "N",
                L: "S",
                F: currentPos => {
                    const newVal = x - 1;
                    const newPos = [newVal, y, o].toString();
                    x = this.move(newPos, currentPos, newVal, x, this.maxX);
                }
            },
        };
        for (let move of movements) {
            if(!this.currentRobotIsOff) {
                switch(move) {
                    case "R":
                        o = actions[o].R
                        break;
                    case "L":
                        o = actions[o].L;
                        break;
                    default:
                        actions[o].F([x, y, o].toString())
                        break;
                }
            } else {
                break;
            }
        };
        const result = "" + x + y + o;
        return `${result}${this.currentRobotIsOff ? "LOST" : ""}`;
    }
    move(newPos, currentPos, newVal, currentVal, maxBound) {
        if (!this.isBlocked(newPos, currentPos)) {
            if(newVal < 0 || newVal > maxBound) {
                this.blockedCoords.push(currentPos);
                this.currentRobotIsOff = true;
                return currentVal;
            }
            return newVal;
        }
        return currentVal;
    }
    isBlocked(...positions){
        return positions.some(pos => this.blockedCoords.includes(pos));
    }
}

module.exports = RobotsService;
