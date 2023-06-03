import {test, expect} from "@playwright/test";
import {generateRandomString, generatePhoneNumber, generateSSN, generateFName, generateLName} from "./utils";

const randomstring = require("randomstring");
//this will be used as a test hook to be run on each test to ensure correct test set up
/*test("Register user account setup", async ({page}) => {
    // Go to the starting url before each test.
    await page.goto('');
    await page.getByRole('link', {name: 'Admin Page'}).click();
    await page.getByRole('button', {name: 'Clean'}).click();
    await page.getByRole('button', {name: 'Initialize'}).click();
    await page.locator('#accessMode3').check();
    await page.locator('#initialBalance').click();
    await page.getByRole('button', {name: 'Submit'}).click();
});*/
test.describe(" Registration tests", async () => {
    test("User attempts to register account without entering mandatory data", async ({page,baseURL}) => {
        //navigate to parabank url, baseurl stored in config file
        await page.goto(baseURL);
        //click on the register link followed by the register button without entering any data on /register.htm page
        await page.getByRole('link', {name: 'Register'}).click();
        await page.getByRole('button', {name: 'Register'}).click();
        //Assertion for verifying each fields validation
        await expect(page.getByText('First name is required.')).toBeVisible();
        //another way to ensure the validation text is present on the page
        await expect(page.locator('[id="customer.firstName.errors"]')).toHaveText('First name is required.');
        await expect(page.getByText('Last name is required.')).toBeVisible();
        await expect(page.getByText('Address is required.')).toBeVisible();
        await expect(page.getByText('City is required.')).toBeVisible();
        await expect(page.getByText('State is required.')).toBeVisible();
        await expect(page.getByText('Zip Code is required.')).toBeVisible();
        await expect(page.getByText('Social Security Number is required.')).toBeVisible();
        await expect(page.getByText('Username is required.')).toBeVisible();
        await expect(page.getByText('Password is required.')).toBeVisible();
        await expect(page.getByText('Password confirmation is required.')).toBeVisible();
    });


    test("User enters incorrect confirmation password - mismatch", async ({page,baseURL}) => {
        //navigate to parabank url, baseurl stored in config file
        await page.goto(baseURL + 'register.htm');
        await page.locator('[id="customer.password"]').fill(generateRandomString(10));
        await page.locator('#repeatedPassword').fill(generateRandomString(10));
        await page.getByRole('button', {name: 'Register'}).click();
        await expect(page.locator('[id="repeatedPassword.errors"]')).toHaveText('Passwords did not match.');
    });

    test("Successfully Register Account", async ({page,baseURL}) => {
        //navigate to parabank url, baseurl stored in config file
        await page.goto( baseURL + 'register.htm');
        await page.locator('[id="customer.firstName"]').fill(generateFName);
        await page.locator('[id="customer.lastName"]').fill(generateLName);
        await page.locator('[id="customer.address.street"]').fill(generateRandomString(9));
        await page.locator('[id="customer.address.city"]').fill(generateRandomString(10));
        await page.locator('[id="customer.address.state"]').fill(generateRandomString(15));
        await page.locator('[id="customer.address.zipCode"]').fill(generateRandomString(7));
        await page.locator('[id="customer.phoneNumber"]').fill('077' + generatePhoneNumber);
        await page.locator('[id="customer.ssn"]').fill(generateSSN);
        await page.locator('[id="customer.username"]').fill(generateRandomString(10));
        await page.locator('[id="customer.password"]').fill('test1');
        await page.locator('#repeatedPassword').fill('test1');
        await page.getByRole('button', {name: 'Register'}).click();
    })
});