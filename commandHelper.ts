//a file for asking user for inputs
import { createInterface } from 'node:readline';
import getRobot from './robot';

const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
});

export async function getUserInput(prompt: string): Promise<string>
{
	return new Promise((resolve) => rl.question(buildPrompt(prompt), (answer: string) => {
		rl.close();
		resolve(answer);
	}));
}

export async function getUserConfirm(prompt: string): Promise<boolean>
{
    const printQuestion = (() => console.log(buildPrompt(prompt + ' Y/N?')));

	return new Promise((resolve) => rl.question(buildPrompt(prompt + ' Y/N?'), (answer: string) => {
		if(answer.match(/(yes|y|no|n)/i)) {
            rl.close();
            resolve(answer.match(/(yes|y)/i) ? true : false);
        } else {
            printQuestion();
        }
	}));
}

export async function userInputThread(prompts: string[]): Promise<string[]>
{
    const answers: string[] = [];

    for(const [index, prompt] of prompts.entries()) {
        const answer: string = await new Promise((resolve) => rl.question(buildPrompt(prompt), (answer: string) => {
            resolve(answer);
        }));

        answers.push(answer);

        if(index === prompts.length - 1) {
            rl.close();
        }
    }

    return answers;
}

function buildPrompt(prompt: string): string
{
    return [
        `\u001b[1;32m${getRobot(prompt)}`,
        `\u001b[0;36m Reply: `
    ].join("\n");
}