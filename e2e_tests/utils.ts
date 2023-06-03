import {Page} from "@playwright/test";

const randomstring = require("randomstring");

export const setupAdminPage = async function (page: Page) {
    await page.goto('https://parabank.parasoft.com/parabank/admin.htm');
    await page.locator('#accessMode3').check();
    await page.locator('#initialBalance').fill('1000');
    await page.locator('#minimumBalance').fill('100');
    await page.getByRole('button', {name: 'Submit'}).click();
};

export const enterRegistrationAccountDetails = async function (page: Page) {
    await page.locator('[id="customer.firstName"]').fill(generateFName);
    await page.locator('[id="customer.lastName"]').fill(generateLName);
    await page.locator('[id="customer.address.street"]').fill(generateRandomString(9));
    await page.locator('[id="customer.address.city"]').fill(generateRandomString(10));
    await page.locator('[id="customer.address.state"]').fill(generateRandomString(15));
    await page.locator('[id="customer.address.zipCode"]').fill(generateRandomString(7));
    await page.locator('[id="customer.phoneNumber"]').fill('077' + generatePhoneNumber);
    await page.locator('[id="customer.ssn"]').fill(generateSSN);
    await page.locator('[id="customer.username"]').fill(generateRandomString(10));
    let password = generateRandomString(5);
    await page.locator('[id="customer.password"]').fill(`${password}`);
    await page.locator('#repeatedPassword').fill(`${password}`);

    await page.getByRole('button', {name: 'Register'}).click();
};

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