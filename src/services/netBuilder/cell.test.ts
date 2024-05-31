import { describe, expect, test } from 'bun:test';
import { Coords } from '../../interfaces';
import Cell, { CellData, InputCellData } from './cell';
import { CellContainment, Direction, SnakePartType } from './enums';

// interface BaseTestDataItem<MethodName extends keyof Cell> {
//     method: MethodName;
//     constructorData: InputCellData;
//     expectData: CellData
// }

// interface TestDataItemInputData<MethodName extends keyof Cell> {
//     inputData: Parameters<Cell[MethodName] & ((...args: any[]) => any)>[0]
// }

// interface TestDataItemNoInputData {
//     inputData?: any;
// }

// type TestDataItem<MethodName extends keyof Cell> = BaseTestDataItem<MethodName>
//     & Cell[MethodName] extends (...args: any[]) => any ? TestDataItemInputData<MethodName> : TestDataItemNoInputData

type TestDataItem<
    MethodName extends keyof Cell
> = {
    method: MethodName;
    constructorData: InputCellData;
    inputData: Cell[MethodName] extends (...args: any[]) => any
    ? Parameters<Cell[MethodName]>[0]
    : never;
    expectData: CellData
}

type Values<O> = O[keyof O]

type OmitNever<O> = Pick<O, Values<{
    [Prop in keyof O]: [O[Prop]] extends [never] ? never : Prop
}>>

// type TestDataItem<
//     MethodName extends keyof Cell
// > = OmitNever<TestDataItemRaw<MethodName>>

// type TestDataItem<
//     MethodName extends keyof Cell
// > = {
//     method: MethodName;
//     constructorData: InputCellData;
//     expectData: CellData
// } & Cell[MethodName] extends ((...args: any[]) => any) ? Parameters<Cell[MethodName]>[0] extends undefined ? { [K in 'inputData']: never } : { inputData: Parameters<Cell[MethodName]>[0] } : { [K in 'inputData']: never }

// function getTestDataItem<
//     MethodName extends keyof Cell,
//     Method extends Cell[MethodName] extends (...args: any[]) => any ? Cell[MethodName] : never
// >({ method, ...rest }: TestDataItem<MethodName, Method>[1]): TestDataItem<MethodName, Method> {
//     return [method, { method, ...rest }]
// }

// type MethodKeys = 'setInitSnakePart' | 'putApple' | 'enterSnake' | 'moveSnake';

type FF = TestDataItem<'moveSnake'>;

type FFF = TestDataItem<'putApple'>;

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

    test.each([['init snake part and get same snake part in next state', <TestDataItem<'setInitSnakePart'>>{
        method: 'setInitSnakePart',
        constructorData: defaultInputCellData,
        inputData: SnakePartType.head,
        expectData: { ...defaultInputCellData, contains: CellContainment.snake, meta: { type: SnakePartType.head, inputDirection: Direction.east, outputDirection: Direction.east } },
    }], ["put apple into empty cell and check it's presence in next state", <TestDataItem<'putApple'>>{
        method: 'putApple',
        inputData: undefined,
        constructorData: defaultInputCellData,
        expectData: { ...defaultInputCellData, contains: CellContainment.apple, meta: null }
    }], ["enter snake into empty cell and check it's appearence in next state", <TestDataItem<'enterSnake'>>{
        method: 'enterSnake',
        constructorData: defaultInputCellData,
        inputData: Direction.north,
        expectData: { ...defaultInputCellData, contains: CellContainment.snake, meta: { type: SnakePartType.head, inputDirection: Direction.north, outputDirection: Direction.north } }
    }], ["move snake in cell where it's head is already present and check if next state contains snake body", <TestDataItem<'moveSnake'>>{
        method: 'moveSnake',
        inputData: undefined,
        constructorData: { ...defaultInputCellData, contains: CellContainment.snake, meta: { type: SnakePartType.head, inputDirection: Direction.north, outputDirection: Direction.east } },
        expectData: { ...defaultInputCellData, contains: CellContainment.snake, meta: { type: SnakePartType.body, inputDirection: Direction.north, outputDirection: Direction.east } }
    }], ["move snake in cell where it's tail is already present and check if next state contains empty", <TestDataItem<'moveSnake'>>{
        method: 'moveSnake',
        inputData: undefined,
        constructorData: { ...defaultInputCellData, contains: CellContainment.snake, meta: { type: SnakePartType.tail, inputDirection: Direction.west, outputDirection: Direction.south } },
        expectData: { ...defaultInputCellData, contains: CellContainment.empty, meta: null }
    }]])('%s', (_, { method, constructorData, inputData, expectData }) => {
        // Arrange
        const initCell = new Cell(constructorData);

        // Act
        if (inputData) {
            (initCell[method] as (arg: typeof inputData) => any)(inputData);
            // initCell[method](inputData);
        } else {
            initCell[method]();
        }
        const nextCellState = initCell.nextState.toData();

        // Assert
        expect(nextCellState).toEqual(expectData);
    })
})