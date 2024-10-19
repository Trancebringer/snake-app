import { MIN_FIELD_SIZE } from "../../constants";
import { isDataWithSnake } from "../../helpers/isDataWithSnake";
import SnakeCell from "../snake/snakeCell";
import BaseList from "./baseList";
import Cell from "./cell";
import { SnakePartType } from "./enums";
import { CellData, InputCellDataWithoutCoords } from './interface';

export type InputCellDataList = Array<InputCellDataWithoutCoords>

export default class Row extends BaseList{
    cells: Array<Cell | SnakeCell>;
    readonly #size: number;
    readonly #rowNumber: number;

    constructor(rowNumber: number, size: number, data?: InputCellDataList) {
        if (size < MIN_FIELD_SIZE) {
            throw new Error('Cannot initialize row of a size less than minimum');
        }
        super();
        this.#rowNumber = rowNumber;
        this.#size = size;
        this.cells = this.listFromData(size, (index, cellData) => {
            const coords = { x: index, y: this.#rowNumber };
            if (cellData && isDataWithSnake(cellData)) {
                return new SnakeCell({ ...cellData, coords });
            }
            return new Cell({ ...cellData, coords });
        }, data);
    }

    public getCellByX(x: number): Cell | SnakeCell {
        if (x > this.#size || x < 0) {
            throw new Error('ROW: provided X is out of range');
        }
        return this.cells[x];
    }

    public initSnake(): Array<SnakeCell> {
        const [tail, body, head] = this.cells as Array<Cell>;
        tail.setInitSnakePart(SnakePartType.tail);
        body.setInitSnakePart(SnakePartType.body);
        head.setInitSnakePart(SnakePartType.head);
        const reversedSnake = [
            tail.nextState as SnakeCell,
            body.nextState as SnakeCell,
            head.nextState as SnakeCell,
        ]
        this.cells = [
            ...reversedSnake,
            ...this.cells.slice(3)
        ]
        return reversedSnake.reverse();
    }

    public getGoingToBeEmptyCells() {
        return this.cells.filter((cell) => cell.willBeEmpty);
    }

    public toData(): CellData[] {
        return this.cells.map((cell) => cell.toData());
    }
}
