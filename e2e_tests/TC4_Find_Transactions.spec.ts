import { test, expect } from '@playwright/test';
import {
    enterRegistrationAccountDetails,
    setupAdminPage
} from "./utils";

test.beforeEach(async ({page}) => {
    await test.step('setup admin page and register account', async () => {
        await setupAdminPage(page);
        await page.getByRole('link', {name: 'Register'}).click();
        await enterRegistrationAccountDetails(page);
    });
});

test.afterEach(async  ({page}) => {
    await page.getByRole('link', {name: 'Log out'}).click();
});

test('User can find transactions created', async ({ page,baseURL }) => {


    await test.step('Click open new savings account link', async () => {
        //clicks open new savings account link
        await page.getByRole('link', { name: 'Open New Account' }).click();
    });

    await test.step('Select the savings accounts option', async () => {
        //select savings account from drop down menu
        await page.locator('#type').selectOption('1');
    });

    await test.step('Store checking account ID in variable', async () => {
        //add wait network idle as the #fromAccountId is slow retrieving account id
        await page.waitForLoadState('networkidle');
        //find the checking accountId and store in variable to be used to find element
        const checkingAccountId = await page.locator('#fromAccountId').textContent();
    });

    await test.step('Click the open new account submit button', async () => {
        //clicks the open new account submit button
        await page.getByRole('button', { name: 'Open New Account' }).click();
    });

    await test.step('Check opening new accounts headings', async () => {
        await expect (page.getByRole('heading', { name: 'Account Opened!' })).toBeVisible();
        await expect (page.getByText('Congratulations, your account is now open.')).toBeVisible();
    });

    const newSavingsAccountId = await test.step('Store saving account ID in variable', async () => {
        //stores the new account id into a variable for assertions
        const newSavingsAccountId = await page.locator('#newAccountId').textContent();
        console.log("New saving account ID: " + newSavingsAccountId);
        return newSavingsAccountId;
    });

    await test.step(`Navigate to account details by click on savings account using stored saving account ${newSavingsAccountId}`, async () => {
        //navigate to account details
        //click on savings account
        await page.getByRole('link', { name: `${newSavingsAccountId}`}).click();
    });

    await test.step('Click on funds transfer received link', async () => {
        await page.getByRole('link', { name: 'Funds Transfer Received' }).click();
    });

    const transactionId = await test.step('Store transaction Id in variable', async () => {
        //store transactionId in variable to ber verified later
        const transactionId = await page.locator('tr:nth-of-type(1) > td:nth-of-type(2)').textContent();
        console.log("Transaction ID: " + transactionId);
        return transactionId;

    });

    await test.step('Click on find transactions link', async () => {
        //navigate to find transactions
        await page.getByRole('link', { name: 'Find Transactions' }).click();
    });

    await test.step('Wait for page to load and select the savings account', async () => {
        //add wait network idle for all data to be present
        await page.waitForLoadState('networkidle');
        //select the savings account from the dropdown menu
        await page.locator('#accountId').selectOption(`${newSavingsAccountId}`);
    });

    await test.step(`Enter ${transactionId} into input the input field and click find transactions`, async () => {
        //enter transaction id into input
        await page.locator('[id="criteria.transactionId"]').fill(`${transactionId}`);
        //click find transactions button
        await page.getByRole('button', { name: 'Find Transactions' }).first().click();
    });


    await test.step('Verify transaction results displayed', async () => {
        //verify the transaction results page
        await expect (page.getByRole('heading', { name: 'Transaction Results' })).toBeVisible();

        //Assert only one row present in the table
        const tbody = page.locator("tbody");
        const rowCount = await tbody.locator("tr").count();
        expect(rowCount).toBe(1);
    });

    await test.step('Click on the Funds Transfer Received link', async () => {
        //click on the transaction link
        await page.getByRole('link', { name: 'Funds Transfer Received' }).click();
    });

    await test.step('Assert transaction ID as expected', async () => {
        //verify the transaction id matches the stored variable
        await expect (page.getByRole('heading', { name: 'Transaction Details' })).toBeVisible();
        await expect(page.locator('tr:nth-of-type(1) > td:nth-of-type(2)')).toHaveText(`${transactionId}`);
    });
});