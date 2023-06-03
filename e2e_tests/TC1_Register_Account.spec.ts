import {test, expect} from "@playwright/test";
import {
    setupAdminPage,
    generateRandomString,
    enterRegistrationAccountDetails
} from "./utils";

test.describe("Suite of Registration tests", async () => {
    //this will be used as a test hook to be run on each test to ensure correct test set up
    test.beforeEach(async ({page}) => {
        await test.step('setup admin page', async () => {
            await setupAdminPage(page);
        });
    });

    test("User attempts to register account without entering mandatory data", async ({page,baseURL}) => {
        await test.step('Navigate to registration page and click register without entering data', async () => {
            //click on the register link followed by the register button without entering any data on /register.htm page
            await page.getByRole('link', {name: 'Register'}).click();
            await page.getByRole('button', {name: 'Register'}).click();
        });
        await test.step('Click register button without entering data', async () => {
            await page.getByRole('button', {name: 'Register'}).click();
        });
        await test.step('Assert all fields for validation', async () => {
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
    });

    test("User enters incorrect confirmation password - mismatch", async ({page,baseURL}) => {
        await test.step('Navigate to registration page and enter different passwords', async () => {
            //click on the register link followed by the register button without entering any data on /register.htm page
            await page.getByRole('link', {name: 'Register'}).click();
        });

        await test.step('Enter incorrect repeated password', async () => {
            await page.locator('[id="customer.password"]').fill(generateRandomString(10));
            await page.locator('#repeatedPassword').fill(generateRandomString(10));
        });

        await test.step('Assert password validation', async () => {
            await page.getByRole('button', {name: 'Register'}).click();
            await expect(page.locator('[id="repeatedPassword.errors"]')).toHaveText('Passwords did not match.');
        });
    });

    test("Successfully Register Account @smoke", async ({page,baseURL}) => {

        await test.step('Navigate to registration page', async () => {
            //click on the register link followed by the register button without entering any data on /register.htm page
            await page.getByRole('link', {name: 'Register'}).click();
        });

        await test.step('Enter mandatory registration details ', async () => {
            await enterRegistrationAccountDetails(page);
        });

        await test.step('User verifies account is created', async () => {
            //check the account is created by the text on the page
            await expect (page.getByText('Your account was created successfully. You are now logged in.')).toBeVisible();
        });
    });
});
