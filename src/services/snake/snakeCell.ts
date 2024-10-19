import GameEndError from "../../errors/gameEndError";
import { isDataWithSnake } from "../../helpers/isDataWithSnake";
import { Coords } from "../../interfaces";
import Cell from "../netBuilder/cell";
import { CellContainment, Direction, SnakePartType } from "../netBuilder/enums";
import { CellData, CellDataWithSnake, ICell, SnakePart } from "../netBuilder/interface";

export default class SnakeCell implements ICell {
    meta: SnakePart;
    contains: CellContainment.snake;
    coords: Coords;
    #nextState?: Cell | SnakeCell;

    constructor(inputData: CellDataWithSnake) {
        this.contains = inputData.contains
        this.meta = inputData.meta;
        this.coords = inputData.coords;
        if (this.contains !== CellContainment.snake) {
            throw new Error('Cell does not contain a snake part');
        }
        if (!this.meta) {
            throw new Error('Cell containment is snake, but no meta found');
        }
    }

    get isEmpty(): boolean {
        return false;
    }

    get willBeEmpty(): boolean {
        if (this.#nextState) {
            return this.#nextState.isEmpty;
        }
        return this.isEmpty;
    }

    get nextState(): Cell | SnakeCell {
        if (this.#nextState) {
            return this.#nextState;
        }
        return this;
    }

    putApple() {
        throw new Error("Can not put apple to Cell already containing snake");
    }

    public copyWithState(copiedState?: CellData) {
        const nextCellState = copiedState || this.toData();
        if (isDataWithSnake(nextCellState)) {
            this.#nextState = new SnakeCell(nextCellState as CellDataWithSnake);
            return;
        }
        this.#nextState = new Cell(copiedState || this.toData());
    }

    public moveSnake(nextSnakePart?: SnakeCell, appleEaten = false) {
        const copiedState: CellData = this.toData();
        if (this.meta.type === SnakePartType.tail) {
            if (!appleEaten) {
                copiedState.contains = CellContainment.empty;
                copiedState.meta = undefined;
            }
            this.copyWithState(copiedState);
            return;
        }
        if (!nextSnakePart) {
            throw new Error('Invalid moveSnake call');
        }
        if (this.meta.type === SnakePartType.body && nextSnakePart.meta.type === SnakePartType.tail && appleEaten) {
            this.copyWithState(copiedState);
            return;
        }
        copiedState.meta = {
            ...this.meta,
            type: nextSnakePart.meta.type,
        }
        this.copyWithState(copiedState);
    }

    public enterSnake(_: Direction): void {
        throw new GameEndError('Snake has bitten itself');
    }

    public toData(): CellDataWithSnake {
        return {
            contains: this.contains,
            meta: this.meta,
            coords: this.coords,
        }
    }
}