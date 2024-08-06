import { test, expect } from "@playwright/test";
import { PageManager } from "../page-objects/pageManager";
import { text } from "stream/consumers";

test.beforeEach(async ({ page }) => {
  await page.goto("/");

  const pm = new PageManager(page)
  await pm.navigateTo().petTypesPage()
});

test("Update pet type", async ({ page }) => {
  const pm = new PageManager(page)
  await pm.onPetTypesPage().updatePetTypeTo('rabbit')
  await pm.onPetTypesPage().updatePetTypeTo('cat')
});

test("Cancel pet type update", async ({ page }) => {
  const pm = new PageManager(page)
  await pm.onPetTypesPage().cancelPetTypeUpdating('moose', 'dog')
});

test("Pet type name is required validation", async ({ page }) => {
  const pm = new PageManager(page)
  await pm.onPetTypesPage().validationMessageChecking("Name is required")
});