import Bounds from "../Robot/Bounds";
import Robot from "../Robot/Robot";

test(`Robot can not be initialized in a position outside of it's boundary`, () => {
    expect(() => {
        new Robot(new Bounds(1, 1), 2, 2, 'N');
    }).toThrow('Outside of boundary');
});

describe(`Robot can alter it's position within it's boundaries`, () => {
    test(`Robot is facing the correct direction`, () => {
        const robot: Robot = new Robot(new Bounds(5, 7), 0, 0, 'N');

        expect(robot.getDirection()).toBe('N');
        robot.rotate('left');

        expect(robot.getDirection()).toBe('W');

        let i = 0;

        while(i < 3) {
            robot.rotate('left');

            i += 1;
        }

        expect(robot.getDirection()).toBe('N');
    });

    test(`Robot can't penetrate it's boundaries`, () => {
        const robot: Robot = new Robot(new Bounds(1, 1), 0, 0, 'N');

        expect(() => {
            robot.move();
        }).toThrow('OUT OF BOUNDS');
    });

    test(`Robot can move in each direction`, () => {
        const robot: Robot = new Robot(new Bounds(2, 2), 0, 0, 'N');
        const yPosition = robot.getPosition('y');
        const xPosition = robot.getPosition('x');

        //facing direction N should only update Y position
        robot.move();
        expect(robot.getPosition('y')).toEqual(yPosition + 1);
        expect(robot.getPosition('x')).toEqual(xPosition);

        //Let's rotate 180 and turn back
        robot.rotate('right');
        robot.rotate('right');

        expect(robot.getDirection()).toBe('S');
        robot.move();
        expect(robot.getPosition('y')).toEqual(yPosition);

        //testing East And West
        //rotate to East
        robot.rotate('left');
        expect(robot.getDirection()).toBe('E');
        robot.move();

        //should have moved one step to the west
        expect(robot.getPosition('x')).toEqual(xPosition + 1);

        //Let's rotate 180 and turn back
        robot.rotate('left');
        robot.rotate('left');
        expect(robot.getDirection()).toBe('W');
        robot.move();
        expect(robot.getPosition('x')).toEqual(xPosition);

        //y position should not have changed when moving horizontally
        expect(robot.getPosition('y')).toEqual(yPosition);

        //we are in 0, 0, facing west, moving any direction that is not east or north should kill the robot
        expect(() => {
            robot.move();
        }).toThrow('OUT OF BOUNDS');
    });
});
