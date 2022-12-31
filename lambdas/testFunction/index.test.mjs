import { handler } from "./index.mjs";

// const { statusCode, headers, body } = handler({ hello: "world" });
const response = handler();
console.log(response);
