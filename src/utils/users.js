export const users = {};

export const getUserByAddress = (address) => users[address];

export const setUserByAddress = (address, user) => {
  users[address] = user;
}