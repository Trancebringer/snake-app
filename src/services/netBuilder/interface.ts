import { Coords } from "../../interfaces";
import type SnakeCell from "../snake/snakeCell";
import type Cell from "./cell";
import { CellContainment, Direction, SnakePartType } from "./enums";

export interface CellData extends BaseCellData {
    contains: CellContainment;
    meta?: SnakePart;
}

interface BaseCellData {
    coords: Coords;
}

export interface CellDataWithSnake extends BaseCellData {
    contains: CellContainment.snake;
    meta: SnakePart;
}

export interface CellDataWithoutSnake extends BaseCellData {
    contains: Exclude<CellContainment, CellContainment.snake>
    meta?: undefined;
}

export type InputCellData = BaseCellData | CellDataWithoutSnake | CellDataWithSnake;

export interface ICell extends CellData {
    isEmpty: boolean;
    willBeEmpty: boolean;
    nextState: Cell | SnakeCell;
    enterSnake(enterDirection: Direction): void;
    toData(): CellData;
    copyWithState(copiedState?: CellData, appleEaten?: boolean): void;
    putApple(): void;
}

export interface SnakePart {
    type: SnakePartType;
    outputDirection: Direction;
    inputDirection: Direction;
}

export interface Size { w: number, l: number }

export type InputCellDataWithoutCoords = Omit<CellData, 'coords'>
