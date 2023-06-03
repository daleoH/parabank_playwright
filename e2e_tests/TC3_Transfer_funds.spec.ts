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

test('User can transfer funds from checking account to new savings account', async ({ page, baseURL}) => {

    await test.step('Opens a new savings account', async () => {
        //clicks open new savings account link
        await page.getByRole('link', { name: 'Open New Account' }).click();
        //add wait network idle as the #fromAccountId is slow retrieving account id
        await page.waitForLoadState('networkidle');
        //select savings account from drop down menu
        await page.locator('#type').selectOption('1');
    });

    const checkingAccountId = await test.step(`Store checking account ID and clicks open new account` , async () => {
        //find the checking accountId and store in variable to be used to find element
        const checkingAccountId = await page.locator('#fromAccountId').textContent();
        console.log("Checking Account ID: " + checkingAccountId);
        //clicks the open new account submit button
        await page.getByRole('button', {name: 'Open New Account'}).click();
        return checkingAccountId;
    });

    await test.step(`Verifies accounts is created` , async () => {
        //check heading for opening new account
        await expect(page.getByRole('heading', {name: 'Account Opened!'})).toBeVisible();
        await expect(page.getByText('Congratulations, your account is now open.')).toBeVisible();
    });

    const newSavingsAccountId = await test.step(`Store new savings account ID` , async () => {
        //stores the new account id into a variable for assertions
        const newSavingsAccountId = await page.locator('#newAccountId').textContent();
        console.log("New saving account ID: " + newSavingsAccountId);
        return newSavingsAccountId;
    });

    await test.step(`Clicks Transfer Funds link` , async () => {
        await page.getByRole('link', { name: 'Transfer Funds' }).click();
        //add wait network idle as the #fromAccountId is slow retrieving account id
        await page.waitForLoadState('networkidle');
    });

    await test.step(`Fill in transfer refund amount` , async () => {
        //Fill in transfer refund amount
        await page.locator('#amount').fill('50');
    });

    await test.step(`Change option from checking account: ${checkingAccountId} to savings account: ${newSavingsAccountId} ` , async () => {
        await page.locator('#fromAccountId').selectOption(`${checkingAccountId}`);
        await page.locator('#toAccountId').selectOption(`${newSavingsAccountId}`);
        await page.getByRole('button', { name: 'Transfer' }).click();
    });

    await test.step(`Click Transfer and verify transfer completed` , async () => {
        //verify transfer completed
        await expect (page.getByRole('heading', { name: 'Transfer Complete!' })).toBeVisible();
        await expect (page.locator(`[ng-if='showResult'] > p:nth-of-type(1)`))
            .toHaveText(`$50.00 has been transferred from account #${checkingAccountId} to account #${newSavingsAccountId}.`);
    });

    await test.step(`Navigate to the Accounts Overview page` , async () => {
        //click the accounts overview link
        await page.getByRole('link', { name: 'Accounts Overview' }).click();
    })

    await test.step(`Assert money within checking (main) account decreased` , async () => {
        //check exact amount for the checking(main) account to ensure money decreased
        await expect (page.getByRole('cell', { name: '$850.00' }).first()).toHaveText('$850.00');
    })

    await test.step(`Assert money within Savings account increased` , async () => {
        //check saving account increased by 50, but not checking exact text
        await expect (page.locator('tr:nth-of-type(2) > td:nth-of-type(2)')).toContainText('$150');
    })

});