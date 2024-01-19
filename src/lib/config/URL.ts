export const BASE_URL =
  process.env.NODE_ENV == "production"
    ? "https://c-space.online"
    : "http://localhost:3000";

console.log("node environment: ", process.env.NODE_ENV);
console.log("base url: ", BASE_URL);
