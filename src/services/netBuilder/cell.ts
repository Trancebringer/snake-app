import { Coords } from "../../interfaces";
import { CellContainment, Direction, SnakePartType } from "./enums";

// type PartialExcept<O extends object, ExceptKey extends keyof O> = Partial<Exclude<O, ExceptKey>> & Pick<O, ExceptKey>;

export interface CellData {
    contains: CellContainment;
    meta: null | SnakePart;
    coords: Coords;
}

// export type InputCellData = PartialExcept<CellData, 'coords'>

interface BaseCellData {
    coords: Coords;
}

interface CellDataWithSnake extends BaseCellData {
    contains: CellContainment.snake;
    meta: SnakePart;
}

interface CellDataWithoutSnake extends BaseCellData {
    contains: Exclude<CellContainment, CellContainment.snake>
    meta?: null;
}

export type InputCellData = BaseCellData | CellDataWithSnake | CellDataWithoutSnake;

export type InputCellDataWithoutCoords = {
    contains: CellContainment.snake;
    meta: SnakePart;
} | {
    contains: Exclude<CellContainment, CellContainment.snake>
    meta?: null;
}

export interface SnakePart {
    type: SnakePartType;
    outputDirection: Direction;
    inputDirection: Direction;
}

export default class Cell implements CellData{
    contains = CellContainment.empty;
    meta: null | SnakePart = null;
    coords: Coords;
    #appleEaten: boolean;
    #nextState?: Cell;

    constructor(inputData: InputCellData, appleEaten = false) {
        this.coords = inputData.coords;
        this.#appleEaten = appleEaten;
        if ('contains' in inputData) {
            this.contains = inputData.contains;
            this.meta = inputData.meta || null;
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

    get nextState(): Cell {
        if (this.#nextState) {
            return this.#nextState;
        }
        return this;
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

    public putApple() {
        if (!this.isEmpty) {
            throw new Error(`Failed to put apple, the cell is already occupied by ${this.contains}`);
        }
        const copiedState = this.toData();
        copiedState.contains = CellContainment.apple;
        copiedState.meta = null;
        this.copyWithState(copiedState);
    }

    public enterSnake(enterDirection: Direction) {
        const copiedState = this.toData();
        switch (true) {
            case this.contains === CellContainment.obstacle:
                throw new Error('Snake hit an obstacle');
            case this.contains === CellContainment.snake:
                throw new Error('Snake bite itself');
            default:
                copiedState.contains = CellContainment.snake;
                copiedState.meta = {
                    type: SnakePartType.head,
                    inputDirection: enterDirection,
                    outputDirection: enterDirection,
                }
        }
        this.copyWithState(copiedState, this.contains === CellContainment.apple);
    }

    public moveSnake() {
        const copiedState = this.toData();
        if (this.contains !== CellContainment.snake) {
            throw new Error('Cell does not contain a snake part');
        }
        if (!this.meta) {
            throw new Error('Cell containment is snake, but no meta found');
        }
        if (this.meta.type === SnakePartType.tail) {
            copiedState.contains = CellContainment.empty;
            copiedState.meta = null;
        } else {
            copiedState.meta = {
                ...this.meta,
                type: this.meta.type === SnakePartType.head ? SnakePartType.body : SnakePartType.tail, // TODO: this implementation expects snake to be always 3 parts of a length
            }
        }
        this.copyWithState(copiedState);
    }

    public toData(): CellData {
        return {
            contains: this.contains,
            meta: this.meta,
            coords: this.coords,
        }
    }

    private copyWithState(copiedState?: CellData, appleEaten = this.#appleEaten) {
        this.#nextState = new Cell(copiedState || this.toData(), appleEaten);
    }
};
