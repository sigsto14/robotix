import Robot, { Direction } from "../../Robot";
import Bounds from "../../Bounds";
import Color from "./Color";

export function displayRobot(msg: string = ''): string
{
    const asciiRobot: string = `d[^_^]b  <`;

    return `${colorCodeMsg(Color.Green, asciiRobot)} ${colorCodeMsg(Color.White, msg)}`;
}

export function gameOver(): string {
    const lines: string[] = [
        `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`,
        `x      d[x_x]b GAME OVER           x`,
        `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
    ];

    return colorCodeMsg(Color.Red, lines.join('\n'));
}

export function displayGrid(bounds: Bounds, robot: Robot|null = null): string
{
    const gridSquare: string = '⬜';
    const grid: string[] = [];

    let i = bounds.getBoundary('y') - 1;
    
    while(i >= 0) {
        const line: string = (() => {
            const arr: string[] = Array(bounds.getBoundary('x')).fill(gridSquare);

            if(robot && i === robot.getPosition('y')) {
                arr.splice(robot.getPosition('x'), 1, arrowIcon(robot.getDirection()));
            }

            return arr;
        })().join('');
        
        grid.push(`${numberIcon(i)} ${line}`);
        i -= 1;
    }

    const xLine: string = ((): string => {
        let i = 0;
        let line = '';

        while(i < bounds.getBoundary('x')) {
            line = line.concat(numberIcon(i) + ' ');

            i += 1;
        }

        return '\u00a0\u00a0' + line;
    })();

    grid.push(xLine);
    
    return `\n\n${grid.join(`\n`)}`;
}

function arrowIcon(direction: Direction): string
{
    switch(direction){
        case 'N': return '🔼';
        case 'E': return '▶️\u00a0'; 
        case 'S': return '🔽';
        case 'W': return '◀️\u00a0';
    }
}

function colorCodeMsg(color: Color, msg: string) {
    return `\u001b${color}${msg} \u001b${Color.White}`;
}

function numberIcon(number: number): string {
    if(number < 0 || number > 9) {
        //något exception
        return '';
    }
    switch(number) {
        case 0: return '0️⃣';
        case 1: return '1️⃣';
        case 2: return '2️⃣';
        case 3: return '3️⃣';
        case 4: return '4️⃣';
        case 5: return '5️⃣';
        case 6: return '6️⃣';
        case 7: return '7️⃣';
        case 8: return '8️⃣';
        case 9: return '9️⃣';
        default: return '';
    }
}