const randomstring = require("randomstring");

export const generateName = randomstring.generate({
    length: 12,
    charset: 'alphabetic'
});

export const generateNumber = randomstring.generate({
    length: 7,
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