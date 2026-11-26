#!/usr/bin/env node

// Supported operations: addition (+), subtraction (-), multiplication (*), and division (/).
function calculate(left, operator, right) {
  const operations = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => a / b,
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
  if (args.length !== 3) {
    throw new Error("Usage: node src/calculator.js <number> <+|-|*|/> <number>");
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

module.exports = { calculate };
