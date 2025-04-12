import Commander from './Commander';
import Robot, { RobotIsDead, InvalidDimension, directions } from './Robot';
import { getArrow, getRobot, gridSquare, getNumber } from './ascii/robot';


const commander: Commander = new Commander();
const robot = new Robot();
const movementCommands: string[] = ['L', 'R', 'F']; 
//TODO: Better input validation
//TODO: Refactor file structure
//TODO: Better grid setup guard

export default async function controlTheRobot(): Promise<void>
{
	const getStarted: boolean = await commander.getUserConfirm(`Hello! I'm Cool-Bot 5000. I heard you want to teach me how to walk today, is that correct?`);

	if(!getStarted) {
		message(getRobot('ok, bye', 'sad'));

		return finish();
	}

	await setupBot();
	controlBot();
}

async function setupBot(): Promise<void>
{
	await setGridDimensions();
	await setBotPosition();

	message(getRobot(`Great! Here is our starting point: \n\n${getGridLine()}`));
}

async function setGridDimensions(): Promise<void>
{
	const options: string[] = [
		'Use Default Grid',
		'Manual Grid Setup',
	];

	const opt: number = await commander.pickOption(`Please select option:`, options);

	if(opt === 2) {
		const dimX: number = await commander.getNumber('How wide is our grid?', 1, 10);
		const dimY: number = await commander.getNumber('How deep is our grid?', 1, 10);
	
		robot.defineGrid(dimX, dimY);
	}

	return Promise.resolve();
}

async function setBotPosition(): Promise<void>
{
	const options: string[] = [
		'Default Robot Placement',
		'Input Robot Placement',
	];

	const opt: number = await commander.pickOption(`Please select option:`, options);

	if(opt === 2) {
		const posX: number = await commander.getNumber('How many x?', 1, robot.grid.xAxis);
		const posY: number = await commander.getNumber('How many y?', 1, robot.grid.yAxis);

		const direction: number = await commander.pickOption('What direction?', directions);

		robot.defineBot(posX, posY, directions[direction - 1] ?? 'N');
	}

	return Promise.resolve();
}

async function controlBot(retry: boolean = false): Promise<void>
{
	const prompt: string = 'Input movement command sequence. L: Turn left, R: Turn right, F: Walk foward.';

	const validateSequence = ((sequence: string): boolean => {
		return sequence.split('').every((c: string): boolean => movementCommands.includes(c));
	});

	const sequence = (await commander.getUserInput(prompt)).toUpperCase();

	if(!validateSequence(sequence)) {
		message('hmm loox like u goofed');

		const tryAgain: boolean = await commander.getUserConfirm(`Your input contains invalid characters. Try again?`);

		if(tryAgain) return Promise.resolve(controlBot());
	}

	handleInputSequence(sequence.split('').filter((c: string): boolean => movementCommands.includes(c)));
}

function handleInputSequence(sequence: string[]): void
{
	for(const command of sequence) {
		if(command === 'L') {
			robot.rotate('left');
		}

		if(command === 'R') {
			robot.rotate('right');
		}

		try {
			if(command === 'F') {
				robot.move();
			}
		} catch(e) {
			return handleError(e);
		}
	}

	message(getRobot(`Great! We end up on ${robot.bot.xPosition} ${robot.bot.yPosition} ${robot.bot.direction} \n\n${getGridLine()}`));
	finish();
}

function finish(): void
{
	commander.close();
	process.exit();
}

function handleError(e: RobotIsDead|InvalidDimension|any): void
{
	restartPrompt(getRobot(e.message || 'WHOOPS', 'dead'));
}

function restartPrompt(msg: string): void
{
	message(msg);

	commander.getUserConfirm(`Try again?`).then((confirmed: boolean) => {
		if(confirmed) {
			return controlTheRobot();
		}

		process.exit();
	});
}

function message(msg: string): void
{
	console.log(msg);
}

function getGridLine(): string
{
	const grid: string[] = [];
	let i = robot.grid.yAxis;
	
	while(i >= 1) {
		const line: string = (() => {
			const arr: string[] = Array(robot.grid.xAxis).fill(gridSquare);

			if(i === robot.bot.yPosition) {
				arr.splice(robot.bot.xPosition - 1, 1, getArrow(robot.bot.direction));
			}

			return arr;
		})().join('');
		
		grid.push(`${getNumber(i)} ${line}`);
		i -= 1;
	}

	const xLine: string = ((): string => {
		let i = 0;
		let line = '';

		while(i <= robot.grid.xAxis) {
			line = line.concat(getNumber(i) + ' ');

			i += 1;
		}

		return line;
	})();

	grid.push(xLine);
	
	return grid.join(`\n`);
}