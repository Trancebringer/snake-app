import Cell from "./cell";

export default class BaseList {
    listFromData<D extends object>(size: number, newItemCb: (i: number, data?: D) => any, data?: Array<D>) {
        if (!data) {
            return this.getDefaultItemArray(size, newItemCb);
        }
        if (data.length > size) {
            throw new Error(`Init data length (${data.length}) is greater, than the row size (${size})`);
        }
        return [
            ...data.map((cellData, index) => newItemCb(index, cellData)),
            ...this.getDefaultItemArray(size - data.length, newItemCb, data.length),
        ];
    }

    public getRandomTo(to: number) {
        const rand = Math.random();
        return Math.round(rand * to);
    }

    private getDefaultItemArray(size: number, newItemCb: (i: number, data?: any) => any, startFrom = 0): Cell[] {
        return Array.from(new Array(size), (_, index) => newItemCb(index + startFrom));
    }
}
