import Bounds, { BOUNDARY_X_LIMIT, BOUNDARY_Y_LIMIT} from "../Robot/Bounds";

test(`Bounds can not be constructed outside limit parameters`, () => {
    expect(() => {
        new Bounds(11, 11);
    }).toThrow('Invalid boundary');
});

test('Boundary parameters can be retrieved', () => {
    const x: number = 10;
    const y: number = 10;

    const bounds: Bounds = new Bounds(x, y);

    expect(bounds.getBoundary('x')).toEqual(x);
    expect(bounds.getBoundary('y')).toEqual(y);
});