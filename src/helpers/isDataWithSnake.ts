import { CellContainment } from "../services/netBuilder/enums";
import { CellDataWithSnake, InputCellDataWithoutCoords } from "../services/netBuilder/interface";

export function isDataWithSnake(cellData: InputCellDataWithoutCoords): cellData is CellDataWithSnake {
    return cellData.contains === CellContainment.snake && typeof cellData.meta !== 'undefined';
}