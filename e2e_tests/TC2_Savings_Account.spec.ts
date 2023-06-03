import {test, expect} from "@playwright/test";
import { generateRandomString, generatePhoneNumber, generateSSN, generateFName, generateLName} from "./utils";


test('test savings', async ({ page,baseURL}) => {

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
    console.log(newSavingsAccountId)
    //click on the savings account id link
    await page.locator('#newAccountId').click();
    //verifies the new account id matches the stored variable (newSavingsAccountId) and check account type and balance
    await expect(page.locator('#accountId')).toContainText(`${newSavingsAccountId}`);
    await expect(page.locator('#accountType')).toHaveText('SAVINGS');
    await expect(page.locator('#balance')).toHaveText('$100.00');

    //navigates to the accounts overview page and checks for added funds
    await page.getByRole('link', { name: 'Accounts Overview' }).click();
    await expect(page.getByRole('cell', { name: '$100.00' }).first()).toHaveText('$100.00');

    /*User clicks on the checking account using the stored variable and checks the balance, In the initial
    admin setup the checking account was $1000, therefore deduction was made from (main) account*/
    await page.getByRole('link', { name: `${checkingAccountId}` }).click();
    await expect (page.getByRole('heading', { name: 'Account Details' })).toBeVisible();
    expect (await page.getByRole('row', { name: 'Balance: $900.00' })
        .getByRole('cell', { name: '$900.00' }).isVisible());
});