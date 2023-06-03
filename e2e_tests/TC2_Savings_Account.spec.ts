import {test, expect} from "@playwright/test";
import {setupAdminPage, enterRegistrationAccountDetails} from "./utils";


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

test('User can create an new savings account @smoke', async ({page, baseURL}) => {


    await test.step('Opens a new savings account', async () => {
        //clicks open new savings account link
        await page.getByRole('link', {name: 'Open New Account'}).click();
    });

    await test.step('Select savings account option', async () => {
        //select savings account from drop down menu
        await page.locator('#type').selectOption('1');
    });

    const checkingAccountId = await test.step(`Store account ID and clicks open new account` , async () => {
        //add wait network idle as the #fromAccountId is slow retrieving account id
        await page.waitForLoadState('networkidle');
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


    const newSavingsAccountId = await test.step(`Store new savings account ID and clicks on new account link` , async () => {
        //stores the new account id into a variable for assertions
        const newSavingsAccountId = await page.locator('#newAccountId').textContent();
        console.log("New saving account ID: " + newSavingsAccountId);
        //click on the savings account id link
        await page.locator('#newAccountId').click();
        return newSavingsAccountId;
    });

    await test.step(`Assert new savings account:  ${newSavingsAccountId} matches stored expected`  , async () => {
        //verifies the new account id matches the stored variable (newSavingsAccountId) and check account type and balance
        await expect(page.locator('#accountId')).toContainText(`${newSavingsAccountId}`);
        await expect(page.locator('#accountType')).toHaveText('SAVINGS');
        await expect(page.locator('#balance')).toHaveText('$100.00');
    });

    await test.step(`Verifies added funds`  , async () => {
        //navigates to the accounts overview page and checks for added funds
        await page.getByRole('link', {name: 'Accounts Overview'}).click();
        await expect(page.getByRole('cell', {name: '$100.00'}).first()).toHaveText('$100.00');
    });


    await test.step(`Verifies the correct balance for checking account: ${checkingAccountId}`  , async () => {
        /*User clicks on the checking account using the stored variable and checks the balance, In the initial
        admin setup the checking account was $1000, therefore deduction was made from (main) account*/
        await page.getByRole('link', {name: `${checkingAccountId}`}).click();
        await expect(page.getByRole('heading', {name: 'Account Details'})).toBeVisible();
        expect(await page.getByRole('row', {name: 'Balance: $900.00'})
            .getByRole('cell', {name: '$900.00'}).isVisible());
    });

});