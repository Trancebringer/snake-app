import { describe, expect, test } from 'bun:test';
import GameEndError from '../../errors/gameEndError';
import { Coords } from '../../interfaces';
import Cell from '../netBuilder/cell';
import { CellContainment, Direction, SnakePartType } from '../netBuilder/enums';
import { CellData, CellDataWithSnake } from '../netBuilder/interface';
import SnakeCell from './snakeCell';

type BaseTestDataItem = {
    constructorData: CellDataWithSnake;
    expectData: CellData;
    expectedNextStepConstructorType?: object;
}

type TestDataItem<MethodName extends keyof SnakeCell, Method = SnakeCell[MethodName]> = BaseTestDataItem & (Method extends (...args: any[]) => any
    ? Parameters<Method>[0] extends undefined
    ? {
        method: MethodName;
    }
    : {
        method: MethodName;
        inputData: Parameters<Method>
    }
    : never);

function getTestDataItem<MethodName extends keyof SnakeCell>(actionMsg: string, testDataItem: TestDataItem<MethodName>): [string, TestDataItem<MethodName>] {
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

type CellMethodsWithArgs = MethodsWithArgsOf<SnakeCell>;

type CellMethodsWithoutArgs = MethodsWithoutArgsOf<SnakeCell>;

describe('Test Cell class', () => {

    const defaultCoords: Coords = { x: 2, y: 2 }
    const defaultInputCellDataWithTail: CellDataWithSnake = {
        coords: defaultCoords,
        contains: CellContainment.snake,
        meta: {
            type: SnakePartType.tail,
            inputDirection: Direction.north,
            outputDirection: Direction.east
        }
    };
    const defaultInputCellDataWithBody: CellDataWithSnake = {
        ...defaultInputCellDataWithTail,
        meta: {
            ...defaultInputCellDataWithTail.meta,
            type: SnakePartType.body,
        }
    };
    const defaultInputCellDataWithHead: CellDataWithSnake = {
        ...defaultInputCellDataWithTail,
        meta: {
            ...defaultInputCellDataWithTail.meta,
            type: SnakePartType.head,
        }
    };

    const tailSnakeCell = new SnakeCell(defaultInputCellDataWithTail);
    const bodySnakeCell = new SnakeCell(defaultInputCellDataWithBody);

    test('Test getters', () => {
        // Arrange
        const initCell = new SnakeCell(defaultInputCellDataWithTail);

        //Assert
        expect(initCell.isEmpty).toBe(false);
        expect(initCell.willBeEmpty).toBe(initCell.isEmpty)
    })
    test('Put apple should throw an error', () => {
        // Arrange
        const initCell = new SnakeCell(defaultInputCellDataWithTail);

        // Act and Assert
        expect(initCell.putApple).toThrowError(new Error("Can not put apple to Cell already containing snake"))
    })
    test('Enter snake should throw a game end error', () => {
        // Arrange
        const initCell = new SnakeCell(defaultInputCellDataWithTail);

        // Act and Assert
        expect(initCell.enterSnake).toThrowError(new GameEndError('Snake has bitten itself'))
    })
    test.each([
        getTestDataItem("move snake tail with no apple eaten", {
            method: 'moveSnake',
            inputData: [],
            constructorData: defaultInputCellDataWithTail,
            expectData: { coords: defaultCoords, contains: CellContainment.empty, meta: undefined },
            expectedNextStepConstructorType: Cell,
        }),
        getTestDataItem("move snake tail when apple is eaten", {
            method: 'moveSnake',
            inputData: [undefined, true],
            constructorData: defaultInputCellDataWithTail,
            expectData: defaultInputCellDataWithTail
        }),
        getTestDataItem("move snake body part right next to tail with no apple eaten", {
            method: 'moveSnake',
            inputData: [tailSnakeCell, false],
            constructorData: defaultInputCellDataWithBody,
            expectData: { ...tailSnakeCell.toData(), coords: defaultCoords }
        }),
        getTestDataItem("move snake body part right next to tail with apple eaten", {
            method: 'moveSnake',
            inputData: [tailSnakeCell, true],
            constructorData: defaultInputCellDataWithBody,
            expectData: defaultInputCellDataWithBody
        }),
        getTestDataItem("move snake head part with no apple eaten", {
            method: 'moveSnake',
            inputData: [bodySnakeCell, false],
            constructorData: defaultInputCellDataWithHead,
            expectData: { ...bodySnakeCell.toData(), coords: defaultCoords }
        }),
        getTestDataItem("move snake head part with an apple eaten", {
            method: 'moveSnake',
            inputData: [bodySnakeCell, true],
            constructorData: defaultInputCellDataWithHead,
            expectData: { ...bodySnakeCell.toData(), coords: defaultCoords }
        }),
        getTestDataItem("copy with state creates usual cell if given input data with no snake", {
            method: 'copyWithState',
            inputData: [{
                coords: defaultCoords,
                contains: CellContainment.empty
            }],
            constructorData: defaultInputCellDataWithHead,
            expectData: {
                coords: defaultCoords,
                contains: CellContainment.empty
            },
            expectedNextStepConstructorType: Cell,
        })
    ])('%s', (_, { method, constructorData, expectData, expectedNextStepConstructorType = SnakeCell, ...rest }) => {
        // Arrange
        const initCell = new SnakeCell(constructorData);

        // Act
        if ('inputData' in rest) {
            const { inputData } = rest;
            (initCell[method as CellMethodsWithArgs] as (...arg: typeof inputData) => void)(...inputData);
        } else {
            initCell[method as CellMethodsWithoutArgs]();
        }
        const nextCellState = initCell.nextState.toData();

        if (expectedNextStepConstructorType) {
            expect(initCell.nextState).toBeInstanceOf(expectedNextStepConstructorType)
        }

        // Assert
        expect(nextCellState).toEqual(expectData);
    })
})