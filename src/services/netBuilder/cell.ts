import GameEndError from "../../errors/gameEndError";
import { isDataWithSnake } from "../../helpers/isDataWithSnake";
import { Coords } from "../../interfaces";
import SnakeCell from "../snake/snakeCell";
import { CellContainment, Direction, SnakePartType } from "./enums";
import { CellData, CellDataWithSnake, ICell, InputCellData } from "./interface";

// type PartialExcept<O extends object, ExceptKey extends keyof O> = Partial<Exclude<O, ExceptKey>> & Pick<O, ExceptKey>;

export default class Cell implements ICell {
    contains: CellContainment = CellContainment.empty;
    meta: undefined;
    coords: Coords;
    #appleEaten: boolean;
    #nextState?: Cell | SnakeCell;

    constructor(inputData: InputCellData, appleEaten = false) {
        this.coords = inputData.coords;
        this.#appleEaten = appleEaten;
        if ('contains' in inputData) {
            if (inputData.contains === CellContainment.snake) {
                throw new Error('Cell initialization error, initializing usual cell with snake is forbidden.')
            }
            this.contains = inputData.contains;
        }
    }

    get isAppleEaten() {
        const result = this.#appleEaten;
        // this.#appleEaten = false; // todo: May be unnecessary
        return result;
    }

    get isEmpty(): boolean {
        return this.contains === CellContainment.empty;
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

    public putApple() {
        if (!this.isEmpty) {
            throw new Error(`Failed to put apple, the cell is already occupied by ${this.contains}`);
        }
        const copiedState = this.toData();
        copiedState.contains = CellContainment.apple;
        copiedState.meta = undefined;
        this.copyWithState(copiedState);
    }

    public enterSnake(enterDirection: Direction) {
        const copiedState = this.toData();
        switch (this.contains) {
            case CellContainment.obstacle:
                throw new GameEndError('Snake has bumped an obstacle');
            case CellContainment.apple:
                this.#appleEaten = true;
                break;
            case CellContainment.empty:
                this.#appleEaten = false;
        }
        copiedState.contains = CellContainment.snake;
        copiedState.meta = {
            type: SnakePartType.head,
            inputDirection: enterDirection,
            outputDirection: enterDirection,
        }
        this.copyWithState(copiedState, this.contains === CellContainment.apple);
    }

    public toData(): CellData {
        return {
            contains: this.contains,
            meta: this.meta,
            coords: this.coords,
        }
    }

    public copyWithState(copiedState?: CellData, appleEaten = this.#appleEaten) {
        const nextCellState = copiedState || this.toData();
        if (isDataWithSnake(nextCellState)) {
            this.#nextState = new SnakeCell(nextCellState as CellDataWithSnake);
            return;
        }
        this.#nextState = new Cell(copiedState || this.toData(), appleEaten);
    }

    public setInitSnakePart(partType: SnakePartType) {
        const stateCopy = this.toData();
        stateCopy.contains = CellContainment.snake;
        stateCopy.meta = {
            type: partType,
            inputDirection: Direction.east,
            outputDirection: Direction.east,
        }
        this.copyWithState(stateCopy);
    }
};
