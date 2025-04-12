import { getArrow } from "./ascii/robot";

type Grid = {
    xAxis: number;
    yAxis: number;
}

export type Direction = 'N' | 'E' | 'S' | 'W';

type Bot = {
    xPosition: number;
    yPosition: number;
    direction: Direction;
}

const directions: Direction[] = ['N', 'E', 'S', 'W'];

export class InvalidDimension extends Error {}
export class RobotIsDead extends Error {}

export default class Robot {

    grid: Grid = {
        xAxis: 5,
        yAxis: 7,
    };

    bot: Bot = {
        xPosition: 1,
        yPosition: 1,
        direction: 'N',
    };

    defineGrid(xAxis: number, yAxis: number): void
    {
        if(xAxis < 0 || yAxis < 0) throw new InvalidDimension('dem dimensions be straight crazy, bro');

        this.grid.xAxis = xAxis;
        this.grid.yAxis = yAxis;
    } 

    defineBot(xPosition: number, yPosition: number, direction: Direction): void
    {
        this.bot.xPosition = xPosition;
        this.bot.yPosition = yPosition;
        this.bot.direction = direction;
        this.checkBounds();
    }

    rotate(direction: 'left' | 'right'): void
    {
        const index: number = directions.indexOf(this.bot.direction);

        this.bot.direction = ((): Direction =>{
            switch(direction) {
                case 'left': return directions[index - 1] ?? directions[directions.length - 1];
                case 'right': return directions[index + 1] ?? directions[0];
            }
        })();
    }

    move(): void
    {
        const pos: number = (() => {
            switch(this.bot.direction) {
                case 'N':
                case 'E': 
                    return 1;
                case 'S':
                case 'W':
                    return -1;
            }
        })();

        switch(this.bot.direction) {
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
        this.bot.yPosition += pos;
        this.checkBounds();
    }

    private moveX(pos: number): void
    {
        this.bot.xPosition += pos;
        this.checkBounds();
        
    }

    getPosition(): string {
        return `You are in ${this.bot.xPosition} on the x axis, ${this.bot.yPosition} on the y axis and facing ${getArrow(this.bot.direction)}`;
    }


    private checkBounds(): void {
        if(
            (this.bot.xPosition < 1 || this.bot.yPosition < 1) ||
            (this.bot.xPosition > this.grid.xAxis) || 
            (this.bot.yPosition > this.grid.yAxis)
        ) throw new RobotIsDead('OUT OF BOUNDS');
    }
}