import {test, expect} from "@playwright/test";


test("register test", async ({page}) => {
    //navigate to parabank url, baseurl stored in config file
    await page.goto('');
    //click on the register link followed by the register button without entering any data on /register.htm page
    await page.getByRole('link', {name: 'Register'}).click();
    await page.getByRole('button', {name: 'Register'}).click();
});