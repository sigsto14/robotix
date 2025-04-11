const asciiRobot: string[] = [
    "    (0 0)  <  I AM A ROBOT",
    "   o ( ) o ",
    "      V "
];

export default function getRobot(msg: string = ''): string
{
    const asciiRobot: string[] = [
        `    (0 0)  <  ${msg}`,
        "   o ( ) o ",
        "      V ",
    ];

    return `${asciiRobot.join("\n")} \n`;
}