const randomstring = require("randomstring");

export const generateFName = randomstring.generate({
    length: 6,
    charset: 'alphabetic'
});

export const generateLName = randomstring.generate({
    length: 10,
    charset: 'alphabetic'
});

export const generatePhoneNumber = randomstring.generate({
    length: 8,
    charset: 'numeric'
});

export const generateSSN = randomstring.generate({
    length: 10,
    charset: 'numeric'
});

export const generateRandomString = function (length, randomString = "") {
    randomString += Math.random().toString(20).substr(2, length);
    if (randomString.length > length) return randomString.slice(0, length);
    return generateRandomString(length, randomString);
};
const firstNameArray = [
    "John",
    "Charles",
    "Dale",
    "Wayne",
    "William"
];
const randomFirstName = firstNameArray[Math.floor(Math.random() * firstNameArray.length)];
const lastNameArray = [
    "Wallace",
    "Harris",
    "James",
    "Ford",
    "Norris"
];
const randomLastName = lastNameArray[Math.floor(Math.random() * lastNameArray.length)];