#!/usr/bin/env node

function modulo(a, b) {
  if (b === 0) {
    throw new Error("Cannot calculate modulo by zero.");
  }
  return a % b;
}

function power(base, exponent) {
  return base ** exponent;
}

function squareRoot(n) {
  if (n < 0) {
    throw new Error("Cannot calculate the square root of a negative number.");
  }
  return Math.sqrt(n);
}

// Supported operations: addition (+), subtraction (-), multiplication (*), division (/), modulo (%), and exponentiation (^ or **).
function calculate(left, operator, right) {
  const operations = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => a / b,
    "%": modulo,
    "^": power,
    "**": power,
  };

  if (!Object.prototype.hasOwnProperty.call(operations, operator)) {
    throw new Error(`Unsupported operation: ${operator}`);
  }
  const operation = operations[operator];
  if (operator === "/" && right === 0) {
    throw new Error("Cannot divide by zero.");
  }

  return operation(left, right);
}

function main(args) {
  if (args.length === 2 && args[0] === "sqrt") {
    const input = args[1];
    if (input.trim() === "") {
      throw new Error("The operand must be a valid number.");
    }

    const value = Number(input);
    if (!Number.isFinite(value)) {
      throw new Error("The operand must be a valid number.");
    }

    console.log(squareRoot(value));
    return;
  }

  if (args.length !== 3) {
    throw new Error(
      "Usage: node src/calculator.js <number> <+|-|*|/|%|^|**> <number> | sqrt <number>",
    );
  }

  const [leftInput, operator, rightInput] = args;
  if (leftInput.trim() === "" || rightInput.trim() === "") {
    throw new Error("Both operands must be valid numbers.");
  }

  const left = Number(leftInput);
  const right = Number(rightInput);
  if (!Number.isFinite(left) || !Number.isFinite(right)) {
    throw new Error("Both operands must be valid numbers.");
  }

  console.log(calculate(left, operator, right));
}

if (require.main === module) {
  try {
    main(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = { calculate, modulo, power, squareRoot };
