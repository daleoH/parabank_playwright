import { test, expect } from '@playwright/test';
import {generateFName, generateLName, generatePhoneNumber, generateRandomString, generateSSN} from "./utils";

test('find transaction id', async ({ page,baseURL }) => {

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
    await page.locator('#type').selectOption('1');
    //add wait network idle as the #fromAccountId is slow retrieving account id
    await page.waitForLoadState('networkidle');
    //find the checking accountId and store in variable to be used to find element
    const checkingAccountId = await page.locator('#fromAccountId').textContent();
    //clicks the open new account submit button
    await page.getByRole('button', { name: 'Open New Account' }).click();

    //check heading for opening new account
    await expect (page.getByRole('heading', { name: 'Account Opened!' })).toBeVisible();
    await expect (page.getByText('Congratulations, your account is now open.')).toBeVisible();

    //stores the new account id into a variable for assertions
    const newSavingsAccountId = await page.locator('#newAccountId').textContent();
    console.log(newSavingsAccountId);

    //navigate to account details
    //click on savings account
    await page.getByRole('link', { name: `${newSavingsAccountId}`}).click();

    //click funds transfer received links
    await page.getByRole('link', { name: 'Funds Transfer Received' }).click();

    //store transactionId in variable to ber verified later
    const transactionId = await page.locator('tr:nth-of-type(1) > td:nth-of-type(2)').textContent();

    //navigate to find transactions
    await page.getByRole('link', { name: 'Find Transactions' }).click();
    //add wait network idle for all data to be present
    await page.waitForLoadState('networkidle');
    //select the savings account from the dropdown menu
    await page.locator('#accountId').selectOption(`${newSavingsAccountId}`);

    //enter transaction id into input
    await page.locator('[id="criteria.transactionId"]').fill(`${transactionId}`);
    //click find transactions button
    await page.getByRole('button', { name: 'Find Transactions' }).first().click();

    //verify the transaction results page
    await expect (page.getByRole('heading', { name: 'Transaction Results' })).toBeVisible();

    //Assert only one row present in the table
    const tbody = page.locator("tbody");
    const rowCount = await tbody.locator("tr").count();
    expect(rowCount).toBe(1);

    //click on the transaction link
    await page.getByRole('link', { name: 'Funds Transfer Received' }).click();

    //verify the transaction id matches the stored variable
    await expect (page.getByRole('heading', { name: 'Transaction Details' })).toBeVisible();
    await expect(page.locator('tr:nth-of-type(1) > td:nth-of-type(2)')).toHaveText(`${transactionId}`);
    console.log(transactionId);
});