//The URL will be change. It's depends on server side

const devEnv = {
  //   baseURL: "https://matrix.yavar.ai/",
  baseURL: "http://localhost:8008/",
};
const prodEnv = {
  baseURL: "http://localhost:8008/",
  //   baseURL: "https://matrix.yavar.ai/",
};

const environment =
  process.env.NODE_ENV === "production" ? { ...prodEnv } : { ...devEnv };

export default environment;
