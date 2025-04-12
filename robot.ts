const HAPPY_COLOR = '1;32m';
const SAD_COLOR = '1;31m';
const DEAD_COLOR = '1;31m';

type Mood = 'happy' | 'sad' | 'dead';
export default function getRobot(msg: string = '', mood: Mood = 'happy'): string
{
    const expression: string = ((): string => {
        switch(mood){
            case 'happy': return '^_^';
            case 'sad': return ';_;';
            case 'dead': return 'x x'
        }
    })();

    const asciiRobot: string =  `d[${expression}]b  < \u001b[0;37m${msg}`

    const color: string = ((): string => {
        switch(mood){
            case 'happy': return HAPPY_COLOR;
            case 'sad': return SAD_COLOR;
            case 'dead': return DEAD_COLOR;
        }
    })();

    return `\n \u001b[${color}${asciiRobot} \n`;
}