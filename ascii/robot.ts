import { Direction } from "../Robot";

type Mood = 'happy' | 'sad' | 'dead';

export function getRobot(msg: string = '', mood: Mood = 'happy'): string
{
    const asciiRobot: string =  `d[${getExpression(mood)}]b  < \u001b[0;37m${msg}`

    return `\n ${getColor(mood)}${asciiRobot} \n`;
}

export function getArrow(direction: Direction): string
{
    switch(direction){
        case 'N': return '🔼';
        case 'E': return '▶️'; 
        case 'S': return '🔽';
        case 'W': return '◀️';
    }
}

function getColor(mood: Mood): string
{
    switch(mood){
        case 'happy': return '\u001b[1;32m';
        case 'sad': return '\u001b[1;34m';
        case 'dead': return '\u001b[1;31m';
    }
}

function getExpression(mood: Mood): string
{
    switch(mood){
        case 'happy': return '^_^';
        case 'sad': return ';_;';
        case 'dead': return 'x x'
    }
}

export const gridSquare: string = '⬜';