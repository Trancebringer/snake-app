import { describe, expect, test } from 'bun:test';
import Net from '.';
import { CellContainment, Direction, SnakePartType } from './enums';
import { InputCellDataList } from './row';

describe('Test Net class', () => {
    test('the generation of net should create cells as provided in data and other cells should be filled with empty cells', () => {
        // Arrange
        const netInitData: InputCellDataList[] = [[{
            contains: CellContainment.apple,
        }], [{
            contains: CellContainment.obstacle,
        }, {
                contains: CellContainment.snake,
                meta: {
                    type: SnakePartType.head,
                    inputDirection: Direction.east,
                    outputDirection: Direction.east,
                }
        }]]
        const netSize = 5;

        // Act
        const net = new Net(netSize, netInitData);
        const firstCell = net.getCellByCoords({ x: 0, y: 0 });
        const seocndCell = net.getCellByCoords({ x: 0, y: 1 });
        const thirdCell = net.getCellByCoords({ x: 1, y: 1 });
        const randomEmptyCell = net.getCellByCoords({ x: 4, y: 2 });

        // Assert
        // Check that created cells corresponds to the given data
        expect(firstCell?.contains).toBe(CellContainment.apple);
        expect(seocndCell?.contains).toBe(CellContainment.obstacle);
        expect(thirdCell?.contains).toBe(CellContainment.snake);

        //Check that randomEmptyCell is empty
        expect(randomEmptyCell?.contains).toBe(CellContainment.empty);

        // Check measurements of net
        expect(net.net.length).toBe(netSize);
        net.net.forEach((row) => expect(row.cells.length).toBe(netSize));
    });
    test('Init snake puts a snake of length 3 into a middle row', () => {
        // Arrange
        const net = new Net(5);
        const expectedTailCoords = { x: 0, y: 2 };
        const expectedBodyCoords = { x: 1, y: 2 };
        const expectedHeadCoords = { x: 2, y: 2 };

        // Act
        const snakeCells = net.initSnake();
        const [headCell, bodyCell, tailCell] = snakeCells;

        // Assert
        // check init length of snake
        expect(snakeCells.length).toBe(3);
        // check that we can find initted tail snake part and it is exactly a tail part
        expect(net.getCellByCoords(expectedTailCoords)).toBe(tailCell);
        expect(net.getCellByCoords(expectedTailCoords)?.toData().meta?.type).toBe(SnakePartType.tail);
        // check that we can find initted body snake part and it is exactly a body part
        expect(net.getCellByCoords(expectedBodyCoords)).toBe(bodyCell);
        expect(net.getCellByCoords(expectedBodyCoords)?.toData().meta?.type).toBe(SnakePartType.body);
        // check that we can find initted head snake part and it is exactly a body head
        expect(net.getCellByCoords(expectedHeadCoords)).toBe(headCell);
        expect(net.getCellByCoords(expectedHeadCoords)?.toData().meta?.type).toBe(SnakePartType.head);
    })
})