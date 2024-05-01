import {Coords} from "../../interfaces";
import Cell from "../netBuilder/cell";
import {Direction} from "../netBuilder/enums";
import Net from "../netBuilder";

type Neighbors = {
    [key in Direction]: Coords;
};

export default class Snake {
    head: Cell;
    bodyList: Cell[];
    headNeighbors: Neighbors;
    nextStepHeadPosition: Cell;
    #netLink: Net;

    constructor(net: Net) {
        this.#netLink = net;
        const [head, ...body] = this.#netLink.initSnake();
        this.head = head;
        this.bodyList = body;
        // this.headNeighbors = {
        //     [Direction.north]:
        // }
    }
}