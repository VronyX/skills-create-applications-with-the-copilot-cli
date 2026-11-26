const { spawnSync } = require("node:child_process");
const path = require("node:path");
const { calculate, modulo, power, squareRoot } = require("../calculator");

describe("calculate", () => {
  test.each([
    [2, "+", 3, 5],
    [10, "-", 4, 6],
    [45, "*", 2, 90],
    [20, "/", 5, 4],
    [5, "%", 2, 1],
    [2, "^", 3, 8],
    [2, "**", 3, 8],
    [2, "**", 0, 1],
  ])("calculates %p %s %p as %p", (left, operator, right, expected) => {
    expect(calculate(left, operator, right)).toBe(expected);
  });

  test.each([
    [0, "+", 5, 5],
    [5, "-", 0, 5],
    [0, "*", 5, 0],
    [0, "/", 5, 0],
    [-3, "+", 2, -1],
    [3, "*", -2, -6],
    [1.5, "+", 2.25, 3.75],
    [1, "/", 4, 0.25],
  ])("handles %p %s %p as %p", (left, operator, right, expected) => {
    expect(calculate(left, operator, right)).toBe(expected);
  });

  test("rejects division by zero", () => {
    expect(() => calculate(1, "/", 0)).toThrow("Cannot divide by zero.");
    expect(() => calculate(1, "/", -0)).toThrow("Cannot divide by zero.");
  });

  test("rejects modulo by zero", () => {
    expect(() => calculate(1, "%", 0)).toThrow(
      "Cannot calculate modulo by zero.",
    );
    expect(() => modulo(1, -0)).toThrow("Cannot calculate modulo by zero.");
  });

  test("exports modulo, power, and square root functions", () => {
    expect(modulo(5, 2)).toBe(1);
    expect(power(2, 3)).toBe(8);
    expect(squareRoot(16)).toBe(4);
    expect(squareRoot(0)).toBe(0);
    expect(() => squareRoot(-1)).toThrow(
      "Cannot calculate the square root of a negative number.",
    );
  });

  test.each(["xor", "toString", "__proto__"])(
    "rejects unsupported operation %s",
    (operator) => {
      expect(() => calculate(1, operator, 2)).toThrow(
        `Unsupported operation: ${operator}`,
      );
    },
  );
});

describe("calculator CLI", () => {
  const calculatorPath = path.join(__dirname, "..", "calculator.js");

  test.each([
    [["2", "+", "3"], "5"],
    [["10", "-", "4"], "6"],
    [["45", "*", "2"], "90"],
    [["20", "/", "5"], "4"],
    [["5", "%", "2"], "1"],
    [["2", "^", "3"], "8"],
    [["2", "**", "3"], "8"],
    [["sqrt", "16"], "4"],
  ])("prints the result for %p", (args, expected) => {
    const result = spawnSync(process.execPath, [calculatorPath, ...args], {
      encoding: "utf8",
    });

    expect(result.status).toBe(0);
    expect(result.stdout.trim()).toBe(expected);
    expect(result.stderr).toBe("");
  });

  test.each([
    [[], "Usage:"],
    [["abc", "+", "1"], "Both operands must be valid numbers."],
    [["1", "xor", "2"], "Unsupported operation: xor"],
    [["1", "/", "0"], "Cannot divide by zero."],
    [["sqrt", "-1"], "Cannot calculate the square root of a negative number."],
    [["1", "%", "0"], "Cannot calculate modulo by zero."],
  ])("reports errors for arguments %p", (args, expectedError) => {
    const result = spawnSync(process.execPath, [calculatorPath, ...args], {
      encoding: "utf8",
    });

    expect(result.status).toBe(1);
    expect(result.stderr).toContain(expectedError);
  });
});
