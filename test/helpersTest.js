const { assert } = require('chai');

const { emailLookup,urlsForUser } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

const testUrlDatabase = {
  "sdfgfdsga": {
    longUrl: "http://www.lighthouselabs.ca",
    userID: "user1RandomID"
  },
  "asdf": {
    longUrl: "http://www.google.com",
    userID: "user1RandomID"
  },
  "asdfas": {
    longUrl: "http://www.zara.com",
    userID: "user2RandomID"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = emailLookup("user@example.com", testUsers);
    const expectedOutput = "userRandomID";
    assert.equal(user,expectedOutput);
  });
});

describe('urlsForUser', function() {

  it('should return an object of url information specific to the given user ID', function() {
    const specificUrls = urlsForUser("user1RandomID", testUrlDatabase);
    const expectedOutput = {
      "sdfgfdsga": {
        longUrl: "http://www.lighthouselabs.ca",
        userID: "user1RandomID"
      },
      "asdf": {
        longUrl: "http://www.google.com",
        userID: "user1RandomID"
      }
    };
    assert.deepEqual(specificUrls, expectedOutput);
  });

  it('should return an empty object if no urls exist for a given user ID', function() {
    const noSpecificUrls = urlsForUser("fakeUser", testUrlDatabase);
    const expectedOutput = {};
    assert.deepEqual(noSpecificUrls, expectedOutput);
  });
});
