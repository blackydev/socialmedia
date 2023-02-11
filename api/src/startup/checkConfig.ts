import config from "config";

const check = (property: string) => {
  if (!config.has(property))
    throw new Error(`FATAL ERROR: ${property} is not defined.`);
};

export default () => {
  const values = ["db", "jwtPrivateKey"];
  for (const val of values) check(val);
};
