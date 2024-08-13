import { test } from "@playwright/test";
import { PageManager } from "../page-objects/pageManager";

test.beforeEach(async ({ page }) => {
  await page.goto("/");

  const pm = new PageManager(page)
  await pm.navigateTo().petTypesPage()
});

test("Update pet type", async ({ page }) => {
  const pm = new PageManager(page)
  await pm.onPetTypesPage().selectEditPetByIndex(0)
  await pm.onPetDetailsPage().updatePetTypeTo('rabbit')
  await pm.onPetTypesPage().validateRowValueByIndex(0, 'rabbit')

  await pm.onPetTypesPage().selectEditPetByIndex(0)
  await pm.onPetDetailsPage().updatePetTypeTo('cat')
  await pm.onPetTypesPage().validateRowValueByIndex(0, 'cat')


});

test("Cancel pet type update", async ({ page }) => {
  const pm = new PageManager(page)
  await pm.onPetTypesPage().selectEditPetByIndex(1)
  await pm.onPetDetailsPage().cancelUpdateOfPetType('moose')

  await pm.onPetTypesPage().validateRowValueByIndex(1, 'dog')
});

test("Pet type name is required validation", async ({ page }) => {
  const pm = new PageManager(page)
  await pm.onPetTypesPage().selectEditPetByIndex(2)
  await pm.onPetDetailsPage().validationMessageChecking('Name is required')
});