import { createEventEmitter } from "../dist/index.esm.js";

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

// 普通监听器
emitter.on("user:greet", greet);
emitter.on("math:add", addNumbers);
emitter.on("timer:tick", tick);

// 全局监听器示例 - 监听所有事件
const globalListener = (data: AppEvents[keyof AppEvents]) => {
  console.log("🔔 [全局监听] 事件被触发，数据:", data);
};

emitter.onAll(globalListener);

// once 监听器示例 - 只执行一次
const onceGreet = ({ name }: AppEvents["user:greet"]) => {
  console.log(`⭐ [一次性监听] Hello, ${name}! (这只会执行一次)`);
};

emitter.once("user:greet", onceGreet);

async function runExample() {
  emitter.emit("user:greet", { name: "Holly" });
  emitter.emit("user:greet", { name: "Second" });
  
  // 移除全局监听器
  console.log("\n=== 移除全局监听器后 ===");
  emitter.offAll(globalListener);
  emitter.emit("user:greet", { name: "Final" });
}

runExample();
