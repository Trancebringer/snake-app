import { Coords } from "../../interfaces";
import SnakeCell from "../snake/snakeCell";
import BaseList from "./baseList";
import { CellData, Size } from "./interface";
import Row, { InputCellDataList } from "./row";

export default class Net extends BaseList{
    net: Row[];
    #size: Size;

    constructor(size: number | Size, data?: InputCellDataList[]) {
        super();
        this.#size = typeof size === 'number' ? {w: size, l: size} : size;
        this.net = this.listFromData(this.#size.l, (index, rowData) => new Row(index, this.#size.w, rowData), data);
    }

    public getCellByCoords(coords: Coords) {
        const {x, y} = coords;
        if (y > this.#size.l || y < 0) {
            console.warn('NET: provided Y is out of range', { size: this.#size, coords })
            return undefined;
        }
        const desiredRow = this.net[y];
        return desiredRow.getCellByX(x);
    }

    public initSnake(): Array<SnakeCell> {
        const centerRowIndex = Math.round((this.#size.l - 1) / 2);
        const centerRow = this.net[centerRowIndex];
        return centerRow.initSnake();
    }

    public generateApple() {
        const unoccupied = this.net.flatMap((row) => row.getGoingToBeEmptyCells());
        const index = this.getRandomTo(unoccupied.length);
        unoccupied[index].putApple();
    }

    public toData(): CellData[][] {
        return this.net.map((row) => row.toData());
    }
}
