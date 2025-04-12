import { createInterface, Interface as RlInterface } from 'node:readline';
import getRobot from './robot';

export default class Commander {
    rl: RlInterface;

    constructor() {
        this.rl = createInterface({
            input: process.stdin,
            output: process.stdout,
        });
    }

    async getUserInput(prompt: string): Promise<string>
    {
        return new Promise((resolve) => this.rl.question(buildPrompt(prompt), (answer: string) => {
            resolve(answer);
        }));
    }

    async getUserConfirm(prompt: string): Promise<boolean>
    {
        const question: string = buildPrompt(prompt + ' Y/N?');

        return new Promise((resolve) => this.rl.question(question, (answer: string) => {
            if(answer.match(/(yes|y|no|n)/i)) {
                resolve(answer.match(/(yes|y)/i) ? true : false);
            } else {
                return this.getUserConfirm(prompt);
            }
        }));
    }

    async userInputThread(prompts: string[]): Promise<string[]>
    {
        const answers: string[] = [];

        for(const [index, prompt] of prompts.entries()) {
            const answer: string = await new Promise((resolve) => this.rl.question(buildPrompt(prompt), (answer: string) => {
                resolve(answer);
            }));

            answers.push(answer);
        }

        return answers;
    }

    close(): void
    {
        this.rl.close();
    }
}

function buildPrompt(prompt: string): string
{
    return [
        getRobot(prompt),
        `\u001b[0;35m Reply: \u001b[0;37m`
    ].join("\n");
}