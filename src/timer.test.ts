import timer, { ITime } from "./timer";

describe("Test increments", () => {
    const matrix: { initial: ITime; incremented: ITime }[] = [
        {
            initial: { minus: true, minutes: 1, seconds: 30 },
            incremented: { minus: true, minutes: 1, seconds: 29 },
        },
        {
            initial: { minus: true, minutes: 1, seconds: 0 },
            incremented: { minus: true, minutes: 0, seconds: 59 },
        },
        {
            initial: { minus: true, minutes: 0, seconds: 20 },
            incremented: { minus: true, minutes: 0, seconds: 19 },
        },
        {
            initial: { minus: true, minutes: 0, seconds: 1 },
            incremented: { minus: true, minutes: 0, seconds: 0 },
        },
        {
            initial: { minus: true, minutes: 0, seconds: 0 },
            incremented: { minus: false, minutes: 0, seconds: 1 },
        },
        {
            initial: { minus: false, minutes: 0, seconds: 19 },
            incremented: { minus: false, minutes: 0, seconds: 20 },
        },
        {
            initial: { minus: false, minutes: 0, seconds: 59 },
            incremented: { minus: false, minutes: 1, seconds: 0 },
        },
        {
            initial: { minus: false, minutes: 1, seconds: 0 },
            incremented: { minus: false, minutes: 1, seconds: 1 },
        },
        {
            initial: { minus: false, minutes: 1, seconds: 59 },
            incremented: { minus: false, minutes: 2, seconds: 0 },
        },
    ];

    const sign = (time: ITime) => (time.minus ? "-" : "+");
    const seconds = (time: ITime) =>
        time.seconds.toLocaleString(undefined, {
            minimumIntegerDigits: 2,
        });

    const timeToString = (t: ITime) => `T${sign(t)}${t.minutes}:${seconds(t)}`;

    matrix.forEach((value) => {
        const { initial, incremented } = value;

        it(`${timeToString(initial)} -> ${timeToString(incremented)}`, () => {
            timer.reset(initial);
            timer.start();
            expect(timer.incremented()).toStrictEqual(incremented);
        });
    });
});
