import Commander from './Commander';
import getRobot from './robot';

const grid: string = '[ ]';
const commander: Commander = new Commander();

export default async function controlTheRobot(): Promise<void>
{
	const getStarted: boolean = await commander.getUserConfirm(`Hello! I'm Cool-Bot 5000. I heard you want to teach me how to walk today, is that correct?`);

	if(!getStarted) {
		commander.close();
		return message(getRobot('ok, bye', 'sad'));
	}

	message(getRobot('Great! First let me know a few things,'));

	const gridLinePrompts = [
		"What's the width of mah grid?",
		"Whats the height of mah grid?",
		"Where do I start?",
	];

	const answers = await commander.userInputThread(gridLinePrompts);

	console.log(answers);
	return;
	
    commander.getUserInput('hej hej på dej! Your turn: ').then((answer: string) => console.log(answer));

}

export function message(msg: string): void
{
	console.log(msg);
}

function getGridLine(width: number, height: number): string
{
	const line = grid.repeat(width)
	
	return `${line} \n`.repeat(height);
}