

export class InvalidBoundary extends Error {}

export const BOUNDARY_X_LIMIT = 10;
export const BOUNDARY_Y_LIMIT = 10;

export default class Bounds {
    private x: number;
    private y: number;

    constructor(x: number, y: number) {
        if(x < 0 || x > BOUNDARY_X_LIMIT || y < 0 || y > BOUNDARY_Y_LIMIT) {
            throw new InvalidBoundary();
        }

        this.x = x;
        this.y = y;
    }

    getBoundary(axis: 'x' | 'y'): number
    {
        switch(axis) {
            case 'x': return this.x;
            case 'y': return this.y;
        }
    }
}