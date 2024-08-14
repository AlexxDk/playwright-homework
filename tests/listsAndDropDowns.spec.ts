import { test, expect } from "@playwright/test";
import { PageManager } from "../page-objects/pageManager";

test.beforeEach(async ({ page }) => {
    await page.goto("/");
    const pm = new PageManager(page)
    await pm.navigateTo().ownersPage()
});

test('Validate selected pet types from the list', async ({ page }) => {
    const pm = new PageManager(page)
    await pm.onOwnersPage().openOwnerInfoPageFor('George Franklin')

    await pm.onOwnerInformationPage().openFormEditPetByName('Leo')

    await pm.onEditPetPage().validateOwnerAndTypeInfo('George Franklin', 'cat')
    await pm.onEditPetPage().validateSelectingAllPetTypes() 
})

test('Validate the pet type update', async ({ page }) => {
    const pm = new PageManager(page)
    await pm.onOwnersPage().openOwnerInfoPageFor('Eduardo Rodriquez')
    await pm.onOwnerInformationPage().openFormEditPetByName('Rosy')
    await pm.onEditPetPage().validatePetNameAndType('Rosy', 'dog')
    await pm.onEditPetPage().updatePetTypeTo('bird')

    await pm.onOwnerInformationPage().validatePetTypeByName('Rosy', 'bird')
    await pm.onOwnerInformationPage().openFormEditPetByName('Rosy')

    await pm.onEditPetPage().updatePetTypeTo('dog')
    await pm.onOwnerInformationPage().validatePetTypeByName('Rosy', 'dog')

})