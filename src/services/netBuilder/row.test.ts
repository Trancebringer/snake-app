import { describe, expect, test } from 'bun:test';
import { CellContainment, Direction, SnakePartType } from './enums';
import Row, { InputCellDataList } from './row';

describe('Test Row class', () => {
    const defaultRowInitData = [0, 5] as const;

    test('getCellByX returns same Cell that was provided on init with remaining cells to be created empty', () => {
        // Arrange
        const firstCellsData: InputCellDataList = [{
            contains: CellContainment.apple,
        }, {
            contains: CellContainment.snake,
            meta: {
                type: SnakePartType.head,
                inputDirection: Direction.east,
                outputDirection: Direction.east,
            }
        }]

        // Act
        const row = new Row(...defaultRowInitData, firstCellsData);

        const firstCell = row.getCellByX(0);
        const secondCell = row.getCellByX(1);
        const thirdCell = row.getCellByX(2);

        const [firstCellFromlist, secondCellFromList, thirdCellFromList] = row.cells;

        // Arrange
        // Check that first two cells correspond to the input Data
        expect(firstCell.contains).toBe(firstCellsData[0].contains);
        expect(secondCell.contains).toBe(firstCellsData[1].contains);
        expect(secondCell.meta).toBe(firstCellsData[1].meta!);

        // Check, that third cell is empty
        expect(thirdCell.contains).toBe(CellContainment.empty)

        // Check that cells from list are the same cells from getCellByX function
        expect([firstCell, secondCell, thirdCell]).toStrictEqual([firstCellFromlist, secondCellFromList, thirdCellFromList]);

        // Check, that the created row has 3 empty cells
        expect(row.getGoingToBeEmptyCells().length).toBe(3);
    });

    test('initSnake puts the snake into row with tail to the left side', () => {
        // Arrange
        const row = new Row(...defaultRowInitData);

        // Act
        const snake = row.initSnake();

        const [tail, body, head] = row.cells;

        // Assert
        // Check that snake returned from method is the same snake from cells
        expect(snake).toStrictEqual([head, body, tail]);

        // Check the contents of the snake
        snake.forEach((part) => {
            expect(part.contains).toBe(CellContainment.snake);
            expect(part.meta?.inputDirection).toBe(Direction.east);
            expect(part.meta?.outputDirection).toBe(Direction.east);
        })
        expect(head.meta?.type).toBe(SnakePartType.head);
        expect(body.meta?.type).toBe(SnakePartType.body);
        expect(tail.meta?.type).toBe(SnakePartType.tail)
    })

    test('toData method', () => {
        // Arrange
        const row = new Row(...defaultRowInitData, [{
            contains: CellContainment.apple,
        }]);

        // Act
        const data = row.toData();

        expect(data).toStrictEqual([{ coords: { x: 0, y: 0 }, contains: CellContainment.apple, meta: null }, { coords: { x: 1, y: 0 }, contains: CellContainment.empty, meta: null }, { coords: { x: 2, y: 0 }, contains: CellContainment.empty, meta: null }, { coords: { x: 3, y: 0 }, contains: CellContainment.empty, meta: null }, { coords: { x: 4, y: 0 }, contains: CellContainment.empty, meta: null }])
    })
})