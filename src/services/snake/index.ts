import GameEndError from "../../errors/gameEndError";
import Net from "../netBuilder";
import Cell from "../netBuilder/cell";
import { Direction } from "../netBuilder/enums";
import SnakeCell from "./snakeCell";

type Neighbors = {
    [key in Direction]: Cell | SnakeCell | undefined;
};

export default class Snake {
    bodyList: Array<SnakeCell>;
    #headNeighbors: Neighbors;
    #netLink: Net;

    constructor(net: Net) {
        this.#netLink = net;
        this.bodyList = this.#netLink.initSnake();
        this.#headNeighbors = this.headNeighbors;
    }

    get head(): SnakeCell {
        return this.bodyList[0];
    }

    get headNeighbors(): Neighbors {
        if (this.#headNeighbors && !Object.values(this.#headNeighbors).includes(this.head)) {
            return this.#headNeighbors;
        }
        const headCoords = this.head.coords;
        return {
            [Direction.east]: this.#netLink.getCellByCoords({ ...headCoords, x: headCoords.x + 1 }),
            [Direction.south]: this.#netLink.getCellByCoords({ ...headCoords, y: headCoords.y - 1 }),
            [Direction.west]: this.#netLink.getCellByCoords({ ...headCoords, x: headCoords.x - 1 }),
            [Direction.north]: this.#netLink.getCellByCoords({ ...headCoords, y: headCoords.y - 1 }),
        }
    }

    get nextStepHeadCell(): Cell | SnakeCell | GameEndError {
        if (!this.head.meta) {
            throw new Error('Snake head does not contain meta info.');
        }
        const nextStepOrEmpty = this.headNeighbors[this.head.meta.outputDirection];
        if (!nextStepOrEmpty) {
            return new GameEndError('Snake has bumped into a wall.')
        }
        return nextStepOrEmpty;
    }

    set moveDirection(newDirection: Direction) {
        const copiedHeadState = this.head.toData();
        this.head.copyWithState({
            ...this.head.toData(),
            meta: {
                ...copiedHeadState.meta,
                outputDirection: newDirection,
            }
        })
    }

    public moveSnake() {
        if (this.nextStepHeadCell instanceof Error) {
            throw this.nextStepHeadCell;
        }
        this.nextStepHeadCell.enterSnake(this.head.meta.outputDirection);
        this.bodyList.forEach((bodyPartCell, i) => bodyPartCell.moveSnake(this.bodyList[i + 1]))
    }
}
