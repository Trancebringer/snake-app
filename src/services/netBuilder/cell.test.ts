import { describe, expect, test } from 'bun:test';
import { Coords } from '../../interfaces';
import Cell from './cell';
import { CellContainment, Direction, SnakePartType } from './enums';
import { CellData, InputCellData } from './interface';

type BaseTestDataItem = {
    constructorData: InputCellData;
    expectData: CellData
}

type TestDataItem<MethodName extends keyof Cell, Method = Cell[MethodName]> = BaseTestDataItem & (Method extends (...args: any[]) => any
    ? Parameters<Method>[0] extends undefined
    ? {
        method: MethodName;
    }
    : {
        method: MethodName;
        inputData: Parameters<Method>[0]
    }
    : never);

function getTestDataItem<MethodName extends keyof Cell>(actionMsg: string, testDataItem: TestDataItem<MethodName>): [string, TestDataItem<MethodName>] {
    return [`${testDataItem.method} ${actionMsg}`, testDataItem]
}

type Values<O> = O[keyof O];

type FilterKeysIfWithArgs<Val extends (...args: any) => any, Key> = Parameters<Val>[0] extends undefined ? never : Key;

type MethodsWithArgsOf<O extends object> = Values<{
    [key in keyof O]: O[key] extends (...args: any) => any ? FilterKeysIfWithArgs<O[key], key> : never;
}>;

type FilterKeysIfWithoutArgs<Val extends (...args: any) => any, Key> = Parameters<Val>[0] extends undefined ? Key : never;

type MethodsWithoutArgsOf<O extends object> = Values<{
    [key in keyof O]: O[key] extends (...args: any) => any ? FilterKeysIfWithoutArgs<O[key], key> : never;
}>;

type CellMethodsWithArgs = MethodsWithArgsOf<Cell>;

type CellMethodsWithoutArgs = MethodsWithoutArgsOf<Cell>;

describe('Test Cell class', () => {

    const defaultCoords: Coords = { x: 0, y: 0 }
    const defaultInputCellData: InputCellData = {
        coords: defaultCoords,
    }

    test('Test getters', () => {
        // Arrange
        const initCell = new Cell(defaultInputCellData);

        //Assert
        expect(initCell.isAppleEaten).toBe(false);
        expect(initCell.isEmpty).toBe(true);
        expect(initCell.willBeEmpty).toBe(initCell.isEmpty)
    })
    test.each([
        getTestDataItem('delivers same snake part in next state', {
            method: 'setInitSnakePart',
            constructorData: defaultInputCellData,
            inputData: SnakePartType.head,
            expectData: { ...defaultInputCellData, contains: CellContainment.snake, meta: { type: SnakePartType.head, inputDirection: Direction.east, outputDirection: Direction.east } },
        }),
        getTestDataItem("into empty cell and check it's presence in next state", {
            method: 'putApple',
            constructorData: defaultInputCellData,
            expectData: { ...defaultInputCellData, contains: CellContainment.apple }
        }),
        getTestDataItem("into empty cell and check it's appearence in next state", {
            method: 'enterSnake',
            constructorData: defaultInputCellData,
            inputData: Direction.north,
            expectData: { ...defaultInputCellData, contains: CellContainment.snake, meta: { type: SnakePartType.head, inputDirection: Direction.north, outputDirection: Direction.north } }
        }),
        // getTestDataItem("move snake in cell where it's head is already present and check if next state contains snake body", {
        //     method: 'moveSnake',
        //     constructorData: { ...defaultInputCellData, contains: CellContainment.snake, meta: { type: SnakePartType.head, inputDirection: Direction.north, outputDirection: Direction.east } },
        //     expectData: { ...defaultInputCellData, contains: CellContainment.snake, meta: { type: SnakePartType.body, inputDirection: Direction.north, outputDirection: Direction.east } }
        // }),
        // getTestDataItem("move snake in cell where it's tail is already present and check if next state contains empty", {
        //     method: 'moveSnake',
        //     constructorData: { ...defaultInputCellData, contains: CellContainment.snake, meta: { type: SnakePartType.tail, inputDirection: Direction.west, outputDirection: Direction.south } },
        //     expectData: { ...defaultInputCellData, contains: CellContainment.empty, meta: null }
        // })
    ])('%s', (_, { method, constructorData, expectData, ...rest }) => {
            // Arrange
            const initCell = new Cell(constructorData);

            // Act
            if ('inputData' in rest) {
                const { inputData } = rest;
                (initCell[method as CellMethodsWithArgs] as (arg: typeof inputData) => void)(inputData);
            } else {
                initCell[method as CellMethodsWithoutArgs]();
            }
            const nextCellState = initCell.nextState.toData();

            // Assert
            expect(nextCellState).toEqual(expectData);
        })
})