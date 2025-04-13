import readline, { Interface as RlInterface } from 'node:readline';
import Color from './assets/Color';

export default class CommanderHandler {
    private rl: RlInterface;

    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: true,
        });
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
        return new Promise((resolve) => this.rl.question(buildPrompt(`${prompt} | Number between ${min} and ${max}`), (answer: string) => {
            const number: number = Number(answer);

            if(isNaN(number) || number < min || number > max) {
                message(colorCodeMsg(`Please provide a valid number between ${min} and ${max}`, 'warning'));
                resolve(this.getNumber(prompt, min, max));
            } 

            resolve(number);
        }));
    }

    async pickOption(prompt: string, options: string[]): Promise<number>
    {
        const str: string = options.map((opt: string, index: number): string => `${index + 1}. ${opt}`).join(`\n`);
        return new Promise((resolve) => this.rl.question(buildPrompt(`${prompt}\n\n${str}`), (answer: string) => {
            const choice: number = Number(answer);

            if(isNaN(choice) || choice < 1 || choice > options.length) {
                message(colorCodeMsg(`Please choose an option between 1 and ${options.length}`, 'warning'));
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
}

function message(msg: string): void
{
    console.log(msg);
}

function colorCodeMsg(msg: string, type: 'info' | 'reply' | 'warning' | 'default' = 'default'): string
{
    const color: string = ((): string => {
        switch(type) {
            case 'warning': return Color.Yellow;
            case 'info': return Color.White;
            case 'reply': return Color.Purple;
            case 'default': return '';
        }
    })();

    return `${color}${msg}${Color.White}`;
}

function buildPrompt(prompt: string): string
{
    return [
        colorCodeMsg(prompt) + `\n`,
        colorCodeMsg('Reply: ', 'reply'),
    ].join("\n");
}