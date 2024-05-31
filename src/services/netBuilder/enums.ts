export enum SnakePartType {
    head = 'head',
    body = 'body',
    tail = 'tail',
}

export enum Direction {
    south = '\/',
    north ='^',
    west = '<-',
    east = '->',
}

export enum CellContainment {
    snake = 'snake',
    apple = 'apple',
    obstacle = 'obstacle',// todo: Add obstacle implementation
    empty = 'empty',
}
