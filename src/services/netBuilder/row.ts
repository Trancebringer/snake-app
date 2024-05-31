import { MIN_FIELD_SIZE } from "../../constants";
import BaseList from "./baseList";
import Cell, { CellData, InputCellDataWithoutCoords } from "./cell";
import { SnakePartType } from "./enums";

export type InputCellDataList = Array<InputCellDataWithoutCoords>

export default class Row extends BaseList{
    cells: Cell[];
    readonly #size: number;
    readonly #rowNumber: number;

    constructor(rowNumber: number, size: number, data?: InputCellDataList) {
        if (size < MIN_FIELD_SIZE) {
            throw new Error('Cannot initialize row of a size less than minimum');
        }
        super();
        this.#rowNumber = rowNumber;
        this.#size = size;
        this.cells = this.listFromData(size, (index, cellData) => new Cell({ ...cellData, coords: { x: index, y: this.#rowNumber } }), data);
    }

    public getCellByX(x: number): Cell {
        if (x > this.#size || x < 0) {
            throw new Error('ROW: provided X is out of range');
        }
        return this.cells[x];
    }

    public initSnake(): Cell[] {
        const [tail, body, head] = this.cells;
        tail.setInitSnakePart(SnakePartType.tail);
        body.setInitSnakePart(SnakePartType.body);
        head.setInitSnakePart(SnakePartType.head);
        this.cells = [
            tail.nextState,
            body.nextState,
            head.nextState,
            ...this.cells.slice(3)
        ]
        const reversedSnake = this.cells.slice(0, 3);
        return reversedSnake.reverse();
    }

    public getGoingToBeEmptyCells() {
        return this.cells.filter((cell) => cell.willBeEmpty);
    }

    public toData(): CellData[] {
        return this.cells.map((cell) => cell.toData());
    }
}
