import { test, expect } from '@playwright/test';
import {generateFName, generateLName, generatePhoneNumber, generateRandomString, generateSSN} from "./utils";

test('transfer funds test', async ({ page, baseURL}) => {

    //Register account steps - this will go in as pom or single function
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

    //verify account created
    await expect (page.getByText('Your account was created successfully. You are now logged in.')).toBeVisible();
    //clicks open new savings account link
    await page.getByRole('link', { name: 'Open New Account' }).click();
    //select savings account from drop down menu
    //add wait network idle as the #fromAccountId is slow retrieving account id
    await page.waitForLoadState('networkidle');
    await page.locator('#type').selectOption('1');
    //find the checking accountId and store in variable to be used to find element
    const checkingAccountId = await page.locator('#fromAccountId').textContent();
    //clicks the open new account submit button
    await page.getByRole('button', { name: 'Open New Account' }).click();

    //check heading for opening new account
    await expect (page.getByRole('heading', { name: 'Account Opened!' })).toBeVisible();
    await expect (page.getByText('Congratulations, your account is now open.')).toBeVisible();

    //stores the new account id into a variable for assertions
    const newSavingsAccountId = await page.locator('#newAccountId').textContent();
    console.log(newSavingsAccountId)

    await page.getByRole('link', { name: 'Transfer Funds' }).click();
    //add wait network idle as the #fromAccountId is slow retrieving account id
    await page.waitForLoadState('networkidle');

    //Fill in transfer refund amount and select from checking to saving account
    await page.locator('#amount').fill('50');
    await page.locator('#fromAccountId').selectOption(`${checkingAccountId}`);
    await page.locator('#toAccountId').selectOption(`${newSavingsAccountId}`);
    await page.getByRole('button', { name: 'Transfer' }).click();
    //verify transfer completed
    await expect (page.getByRole('heading', { name: 'Transfer Complete!' })).toBeVisible();
    await expect (page.locator(`[ng-if='showResult'] > p:nth-of-type(1)`))
        .toHaveText(`$50.00 has been transferred from account #${checkingAccountId} to account #${newSavingsAccountId}.`);

    //navigate back to Accounts overview page
    await page.getByRole('link', { name: 'Accounts Overview' }).click();

    //check exact amount for the checking(main) account to ensure money decreased
    await expect (page.getByRole('cell', { name: '$850.00' }).first()).toHaveText('$850.00');
    //check saving account increased by 50, but not checking exact text
    await expect (page.locator('tr:nth-of-type(2) > td:nth-of-type(2)')).toContainText('$150');

});