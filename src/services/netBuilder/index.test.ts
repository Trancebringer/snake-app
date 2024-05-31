import { describe, expect, test } from 'bun:test';
import Net from '.';
import { CellContainment } from './enums';
import { InputCellDataList } from './row';

describe('Test Net class', () => {
    test('the generation of net should create cells as provided in data and other cells should be filled with empty cells', () => {
        // Arrange
        const netInitData: InputCellDataList[] = [[{
            contains: CellContainment.apple
        }], [{
            contains: CellContainment.obstacle
        }]]
        const netSize = 5;

        // Act
        const net = new Net(netSize, netInitData);
        const firstCell = net.getCellByCoords({ x: 0, y: 0 });
        const seocndCell = net.getCellByCoords({ x: 0, y: 1 });
        const randomEmptyCell = net.getCellByCoords({ x: 4, y: 2 });

        // Assert
        // Check that created cells corresponds to the given data
        expect(firstCell.contains).toBe(CellContainment.apple);
        expect(seocndCell.contains).toBe(CellContainment.obstacle);

        //Check that randomEmptyCell is empty
        expect(randomEmptyCell.contains).toBe(CellContainment.empty);

        // Check measurements of net
        expect(net.net.length).toBe(netSize);
        net.net.forEach((row) => expect(row.cells.length).toBe(netSize));
    })
})