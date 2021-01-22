const { assert } = require('chai');
const { getUserByEmail, urlsForUser, generateRandomString } = require('../helpers');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "123"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

const testURLDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "userRandomID" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "user2RandomID" }
};

describe('getUserByEmail', () => {
  it('should return a user with valid email', () => {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedOutput = {
      id: "userRandomID", 
      email: "user@example.com", 
      password: "123"
    }
    assert.deepEqual(user, expectedOutput);
  });
  it('should return undefined for a non-existent email', () => {
    const user = getUserByEmail("ilikebirds@parrot.com", testUsers)
    const expectedOutput = undefined;
    assert.strictEqual(user,expectedOutput);
  });
});

describe('urlsForUser', () => {
  it('it should return the urls for a user', () => {
    const urls = urlsForUser("userRandomID", testURLDatabase);
    const expectedOutput = {
      b6UTxQ: { longURL: "https://www.tsn.ca", userID: "userRandomID" }}
    assert.deepEqual(urls, expectedOutput);
  });
  it('it should return an empty object if the url is not found', () => {
    const urls = urlsForUser("user3RandomID", testURLDatabase);
    const expectedOutput = {};
    assert.deepEqual(urls, expectedOutput);
  });
});
