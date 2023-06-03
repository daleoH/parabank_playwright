import {test, expect} from "@playwright/test";

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

const generateRandomString = function (length, randomString = "") {
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


test("User attempts to register account without entering mandatory data", async ({page}) => {
    //navigate to parabank url, baseurl stored in config file
    await page.goto('');
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


test("User enters incorrect confirmation password - mismatch", async ({page}) => {
    //navigate to parabank url, baseurl stored in config file
    await page.goto('https://parabank.parasoft.com/parabank/register.htm');
    await page.locator('[id="customer.password"]').fill(generateRandomString(10));
    await page.locator('#repeatedPassword').fill(generateRandomString(10));
    await page.getByRole('button', {name: 'Register'}).click();
    await expect(page.locator('[id="repeatedPassword.errors"]')).toHaveText('Passwords did not match.');
});

test("Successfully Register Account", async ({page}) => {
    //navigate to parabank url, baseurl stored in config file
    await page.goto('https://parabank.parasoft.com/parabank/register.htm');
    await page.locator('[id="customer.firstName"]').fill(randomFirstName);
    await page.locator('[id="customer.lastName"]').fill(randomLastName);
    await page.locator('[id="customer.address.street"]').fill(generateRandomString(9));
    await page.locator('[id="customer.address.city"]').fill(generateRandomString(10));
    await page.locator('[id="customer.address.state"]').fill(generateRandomString(10));
    await page.locator('[id="customer.address.zipCode"]').fill(generateRandomString(10));
    await page.locator('[id="customer.phoneNumber"]').fill(generateRandomString(10));
    await page.locator('[id="customer.ssn"]').fill(generateRandomString(10));
    await page.locator('[id="customer.username"]').fill(generateRandomString(10));
    //todo  will refactor to have random
    await page.locator('[id="customer.password"]').fill('test1');
    await page.locator('#repeatedPassword').fill('test1');
    await page.getByRole('button', {name: 'Register'}).click();
});
