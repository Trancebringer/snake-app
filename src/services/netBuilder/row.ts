import Cell, {CellData} from "./cell";
import BaseList from "./baseList";
import {SnakePartType} from "./enums";

export default class Row extends BaseList{
    cells: Cell[];
    readonly #size: number;
    readonly #rowNumber: number;

    constructor(rowNumber: number, size: number, data?: CellData[]) {
        super();
        this.#rowNumber = rowNumber;
        this.#size = size;
        this.cells = this.listFromData(size, (index, cellData) => new Cell(index, this.#rowNumber, cellData), data);
    }

    public getCellByX(x: number): Cell {
        if (x > this.#size || x < 1) {
            throw new Error('ROW: provided X is out of range');
        }
        return this.cells[x];
    }

    public initSnake(): Cell[] {
        const [tail, body, head] = this.cells;
        tail.setInitSnakePart(SnakePartType.tail);
        body.setInitSnakePart(SnakePartType.body);
        head.setInitSnakePart(SnakePartType.head);
        return [head, body, tail];
    }

    public getGoingToUnoccupiedCells() {
        return this.cells.filter((cell) => cell.willBeEmpty);
    }

    public toData(): CellData[] {
        return this.cells.map((cell) => cell.toData());
    }
}
