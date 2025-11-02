import { createEventEmitter } from "../src";

type AppEvents = {
  "user:greet": { name: string };
  "math:add": { a: number; b: number };
  "timer:tick": number;
};

const emitter = createEventEmitter<AppEvents>();

const greet = ({ name }: AppEvents["user:greet"]) => {
  console.log(`Hello, ${name}!`);
};

const addNumbers = ({ a, b }: AppEvents["math:add"]) => {
  const result = a + b;
  console.log(`${a} + ${b} = ${result}`);
  return Promise.resolve(result);
};

const tick = async (ms: AppEvents["timer:tick"]) => {
  await new Promise((resolve) => setTimeout(resolve, ms));
  console.log(`Tick after ${ms}ms`);
};

emitter.on("user:greet", greet);
emitter.on("math:add", addNumbers);
emitter.on("timer:tick", tick);

async function runExample() {
  emitter.emit("user:greet", { name: "Holly" });

  const results = await emitter.emit("math:add", { a: 2, b: 3 });
  console.log("Received async results:", results);

  await emitter.emit("timer:tick", 500);

  emitter.off("user:greet", greet);
  emitter.emit("user:greet", { name: "Emitter" });
}

runExample();
