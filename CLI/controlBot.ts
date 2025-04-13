import Bounds, { InvalidBoundary, BOUNDARY_X_LIMIT, BOUNDARY_Y_LIMIT} from '../Bounds';
import CommandHandler from './CommandHandler';
import Robot, { RobotIsDead, directions } from '../Robot';
import { Direction } from '../Robot';
import Color from './assets/Color';
import { displayRobot, gameOver, displayGrid } from './assets/robotAssets';


const commander: CommandHandler = new CommandHandler();
type MovementCommand = 'L' | 'R' | 'F';

class InvalidMovementCommand extends Error {}

export default async function controlTheRobot(): Promise<void>
{
	message(displayRobot(`Hello! I'm Cool-Bot 5000. Today we are going to navigate a grid.`));

	const bounds: Bounds = await setupBoundary();
	const robot: Robot = await setupBot(bounds);

	navigate(robot);
}

async function setupBoundary(): Promise<Bounds>
{
	const options: string[] = [
		`Use Default Grid`,
		`Manual Grid Setup`,
	];

	const opt: number = await commander.pickOption(displayRobot(`Let's start by defining grid boundaries.`), options);

	const boundX: number = opt === 2 ? await commander.getNumber(displayRobot(`How wide is our grid?`), 1, BOUNDARY_X_LIMIT) : BOUNDARY_X_LIMIT;
	const boundY: number = opt === 2 ? await commander.getNumber(displayRobot(`How deep is our grid?`), 1, BOUNDARY_Y_LIMIT) : BOUNDARY_Y_LIMIT;
	const bounds = new Bounds(boundX, boundY);
	message(displayRobot(`This is our grid:`) + displayGrid(bounds) + `\n`);

	return Promise.resolve(bounds);
}

async function setupBot(bounds: Bounds): Promise<Robot>
{
	const options: string[] = [
		`Default Robot Placement`,
		`Input Robot Placement`,
	];

	const opt: number = await commander.pickOption(displayRobot(`Now, let's position our robot.`), options);

	const posX: number = opt === 2 ? await commander.getNumber(displayRobot(`What is the x-position?`), 0, bounds.getBoundary('x') - 1) : 0;
	const posY: number = opt === 2 ? await commander.getNumber(displayRobot(`What is the y-position?`), 0, bounds.getBoundary('y') - 1) : 0;
	const direction: Direction = opt === 2 ? directions[(await commander.pickOption(displayRobot(`What direction is the robot facing?`), directions)) - 1] : 'N';

	const robot: Robot = new Robot(bounds, posX, posY, direction);
	message(displayRobot(`Great! Here is our starting point: ${robot.getPosition('x')} ${robot.getPosition('y')} ${robot.getDirection()} ${displayGrid(robot.bounds, robot)}`));

	return Promise.resolve(robot);
}

async function navigate(robot: Robot): Promise<void>
{
	const prompt: string = 'Input movement command sequence | L: Turn left, R: Turn right, F: Walk foward.';

	try {
		const sequence: MovementCommand[] = formatInputSequence(await commander.getUserInput(displayRobot(prompt)));

		handleInputSequence(robot, sequence);

	} catch(e: InvalidMovementCommand|unknown) {
		if(e instanceof InvalidMovementCommand) {
			warn(`Your input contains invalid movement commands.`);

			return Promise.resolve(navigate(robot));
		}

		handleError(e);
	}
}

function formatInputSequence(sequence: string): MovementCommand[]
{
	const commands: MovementCommand[] = [];

	for(const command of sequence.split('')) {
		const c: string = command.toUpperCase();

		switch(c) {
			case 'L':
			case 'R':
			case 'F':
				commands.push(c);
				break;
			default: 
				throw new InvalidMovementCommand();
		}
	}

	return commands;
}

async function handleInputSequence(robot: Robot, sequence: string[]): Promise<void>
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

	message(displayRobot(`Great! We end up on ${robot.getPosition('x')} ${robot.getPosition('y')} ${robot.getDirection()} ${displayGrid(robot.bounds, robot)}`));

	const options: string [] = [
		'Keep going',
		'Start over',
		'Exit',
	];

	const nextStep: number = await commander.pickOption(``, options);

	switch(nextStep) {
		case 1: return navigate(robot);
		case 2: return controlTheRobot();
		default: return finish();
	}
}

function handleError(e: RobotIsDead|InvalidBoundary|any): void
{
	restartPrompt(gameOver());
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

function warn(msg: string): void
{
	console.log(Color.Yellow + msg + `\n`);
}

function finish(): void
{
	message(displayRobot('ok, bye!'));
	commander.close();
	process.exit();
}