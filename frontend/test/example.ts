function sum(a: number, b: number) {
    return a+b;
}

describe("Function sum", () => {
    test("increments a number by 1", () => {
        expect(sum(10, 1)).toBe(11);
    });
});
