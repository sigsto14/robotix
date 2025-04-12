import readline, { Interface as RlInterface } from 'node:readline';
import { getRobot } from './ascii/robot';
import { setMaxListeners } from 'node:events';

export default class Commander {
    rl: RlInterface = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: true,
    });

    constructor() {
        setMaxListeners(20);
    }

    close(): void
    {
        this.rl.close();
    }

    warningMessage(msg: string): void
    {
        console.log(`\u001b[4;33m ${msg} \n`);
    }

    async getUserInput(prompt: string): Promise<string>
    {
        return new Promise((resolve) => this.rl.question(buildPrompt(prompt), (answer: string) => {
            resolve(answer);
        }));
    }

    async getNumber(prompt: string, min: number = 0, max: number = 100): Promise<number>
    {
        return new Promise((resolve) => this.rl.question(buildPrompt(`${prompt}. Number between ${min} and ${max}`), (answer: string) => {
            const number: number = Number(answer);

            if(isNaN(number) || number < min || number > max) {
                this.warningMessage(`Plase provide a valid number between ${min} and ${max}`);
                resolve(this.getNumber(prompt, min, max));
            } 

            resolve(number);
        }));
    }

    async pickOption(prompt: string, options: string[]): Promise<number>
    {
        //throwa om ej options?
        const str: string = options.map((opt: string, index: number): string => `${index + 1}. ${opt}`).join(`\n`);
        return new Promise((resolve) => this.rl.question(buildPrompt(`${prompt}.\n${str}`), (answer: string) => {
            const choice: number = Number(answer);

            if(isNaN(choice) || choice < 1 || choice > options.length) {
                this.warningMessage(`Plase choose an option between 1 and ${options.length}`);
                resolve(this.pickOption(prompt, options));
            } 

            resolve(choice);
        }));
    }

    async getUserConfirm(prompt: string): Promise<boolean>
    {
        const question: string = buildPrompt(prompt + ' Y/N?');

        return new Promise((resolve) => this.rl.question(question, (answer: string) => {
            if(answer.match(/(yes|y|no|n)/i)) {
                resolve(answer.match(/(yes|y)/i) ? true : false);
            } else {
                resolve(this.getUserConfirm(prompt));
            }
        }));
    }

    async userInputThread(prompts: string[]): Promise<string[]>
    {
        const answers: string[] = [];

        for(const prompt of prompts) {
            const answer: string = await new Promise((resolve) => this.rl.question(buildPrompt(prompt), (answer: string) => {
                resolve(answer);
            }));

            answers.push(answer);
        }

        return answers;
    }
}

function buildPrompt(prompt: string): string
{
    return [
        getRobot(prompt),
        `\u001b[0;35m Reply: \u001b[0;37m`
    ].join("\n");
}