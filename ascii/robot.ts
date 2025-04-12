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
        case 'E': return '▶️\u00a0'; 
        case 'S': return '🔽';
        case 'W': return '◀️\u00a0';
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

export function getNumber(number: number): string {
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