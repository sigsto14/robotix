import { getUserInput, userInputThread, getUserConfirm } from './commandHelper';

type GridDimensions = {
	width: number;
	height: number;
}

const grid: string = '[ ]';

export default async function controlTheRobot(): Promise<void>
{
	
	const getStarted: boolean = await getUserConfirm('Are you ready to get this robot walking?');

	console.log(getStarted);
	return;
	userInputThread(['svara mej', 'svara mej da']).then((answers: string[]) => console.log(answers));
    getUserInput('hej hej på dej! Your turn: ').then((answer: string) => console.log(answer));

}

function getGridLine(dimensions: GridDimensions): string
{
	let line: number = 0;

	while(line <= dimensions.height) {
		console.log(grid);
	}

	return grid;
}