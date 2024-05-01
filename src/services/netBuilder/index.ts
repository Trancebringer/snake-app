import Row from "./row";
import Cell, {CellData} from "./cell";
import BaseList from "./baseList";
import {Coords} from "../../interfaces";

export interface Size {w: number, l: number}

export default class Net extends BaseList{
    net: Row[];
    #size: Size;

    constructor(size: number | Size, data?: CellData[][]) {
        super();
        this.#size = typeof size === 'number' ? {w: size, l: size} : size;
        this.net = this.listFromData(this.#size.l, (index, rowData) => new Row(index, this.#size.w, rowData), data);
    }

    public getCellByCoords(coords: Coords) {
        const {x, y} = coords;
        if (y > this.#size.l || y < 1) {
            throw new Error('NET: provided Y is out of range');
        }
        const desiredRow = this.net[y];
        return desiredRow.getCellByX(x);
    }

    public initSnake(): Cell[] {
        const centerRowIndex = Math.round(this.#size.l / 2);
        const centerRow = this.net[centerRowIndex];
        return centerRow.initSnake();
    }

    public generateApple() {
        const unoccupied = this.net.flatMap((row) => row.getGoingToUnoccupiedCells());
        const index = this.getRandomTo(unoccupied.length);
        unoccupied[index].putApple();
    }

    public toData(): CellData[][] {
        return this.net.map((row) => row.toData());
    }
}
