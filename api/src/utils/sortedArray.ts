import _ from "lodash";

export const sortedInsert = <Type>(items: Type[], value: Type) => {
  const i = _.sortedIndex(items, value);
  if (_.isEqual(items[i], value)) return false;

  items.splice(i, 0, value);
  return true;
};

export const sortedDelete = <Type>(items: Type[], value: Type) => {
  const i = _.sortedIndex(items, value);
  if (!_.isEqual(items[i], value)) return false;

  items.splice(i, 1);
  return true;
};
