export enum SnakePartType {
    head,
    body,
    tail,
}

export enum Direction {
    south = '\/',
    north ='^',
    west = '<-',
    east = '->',
}

export enum CellContainment {
    snake,
    apple,
    obstacle,// todo: Add obstacle implementation
    empty,
}
