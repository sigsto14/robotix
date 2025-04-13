import Bounds from "./Bounds";

export type Direction = 'N' | 'E' | 'S' | 'W';
export const directions: Direction[] = ['N', 'E', 'S', 'W'];

export class RobotIsDead extends Error {}

export default class Robot {

    public bounds: Bounds;
    private xPosition: number;
    private yPosition: number;
    private direction: Direction;

    constructor(bounds: Bounds, xPosition: number, yPosition: number, direction: Direction) {
        if(xPosition < 0 || xPosition >= bounds.getBoundary('x') || yPosition < 0 || yPosition >= bounds.getBoundary('y')) {
            throw new RobotIsDead();
        }

        this.bounds = bounds;
        this.xPosition = xPosition;
        this.yPosition = yPosition;
        this.direction = direction;
    }

    rotate(direction: 'left' | 'right'): void
    {
        const index: number = directions.indexOf(this.direction);

        this.direction = ((): Direction =>{
            switch(direction) {
                case 'left': return directions[index - 1] ?? directions[directions.length - 1];
                case 'right': return directions[index + 1] ?? directions[0];
            }
        })();
    }

    move(): void
    {
        const pos: number = (() => {
            switch(this.direction) {
                case 'N':
                case 'E': 
                    return 1;
                case 'S':
                case 'W':
                    return -1;
            }
        })();

        switch(this.direction) {
            case 'N':
            case 'S': 
                this.moveY(pos);
                return;
            case 'E':
            case 'W':
                this.moveX(pos);
                return;
        }
    }

    private moveY(pos: number): void
    {
        this.yPosition += pos;
        this.checkBounds();
    }

    private moveX(pos: number): void
    {
        this.xPosition += pos;
        this.checkBounds();
    }

    private checkBounds(): void {
        if(
            (this.xPosition < 0 || this.yPosition < 0) ||
            (this.xPosition > this.bounds.getBoundary('x') - 1) || 
            (this.yPosition > this.bounds.getBoundary('y') - 1)
        ) throw new RobotIsDead('OUT OF BOUNDS');
    }

    getPosition(axis: 'x' | 'y'): number
    {
        switch(axis) {
            case 'x': return this.xPosition;
            case 'y': return this.yPosition;
        }
    }

    getDirection(): Direction
    {
        return this.direction;
    }
}