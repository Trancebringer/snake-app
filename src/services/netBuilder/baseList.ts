import Cell from "./cell";

export default class BaseList {
    listFromData(size: number, newItemCb: (i: number, data?: any) => any, data?: any[]) {
        if (!data) {
            return this.getDefaultItemArray(size, newItemCb);
        }
        if (data.length > size) {
            throw new Error(`Init data length (${data.length}) is greater, than the row size (${size})`);
        }
        return [
            ...data.map((cellData, index) => newItemCb(index, cellData)),
            ...this.getDefaultItemArray(size - data.length, newItemCb, true),
        ];
    }

    public getRandomTo(to: number) {
        const rand = Math.random();
        return Math.round(rand * to);
    }

    private getDefaultItemArray(size: number, newItemCb: (i: number, data?: any) => any, addSizeToIndex: boolean = false): Cell[] {
        const addedIndex = addSizeToIndex ? size : 0;
        return Array.from(new Array(size), (el, index) => newItemCb(index + addedIndex));
    }
}
