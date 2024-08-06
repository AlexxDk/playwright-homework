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

  const petItemOnTheGrid = await pm.onPetTypesPage().startEditPetTypeOnPosition(0)
  const petInput = await pm.onPetTypesPage().clearPetTypeFromInput()

  await petInput.fill("rabbit");

  await page.getByRole("button", { name: "Update" }).click();

  await expect(petItemOnTheGrid.locator("input")).toHaveValue("rabbit");

  await pm.onPetTypesPage().startEditPetTypeOnPosition(0)

  await pm.onPetTypesPage().clearPetTypeFromInput()
  await petInput.fill("cat");
  await page.getByRole("button", { name: "Update" }).click();
  await expect(petItemOnTheGrid.locator("input")).toHaveValue("cat");
});

test("Cancel pet type update", async ({ page }) => {
  const pm = new PageManager(page)
  const petItemOnTheGrid = await pm.onPetTypesPage().startEditPetTypeOnPosition(1)

  const petInput = await pm.onPetTypesPage().clearPetTypeFromInput()

  await petInput.fill("moose");
  await expect(petInput).toHaveValue("moose");

  await page.getByRole("button", { name: "Cancel" }).click();

  await expect(petItemOnTheGrid.locator("input")).toHaveValue("dog");
});

test("Pet type name is required validation", async ({ page }) => {
  const pm = new PageManager(page)
  await pm.onPetTypesPage().startEditPetTypeOnPosition(2)

  const petInput = await pm.onPetTypesPage().clearPetTypeFromInput()

  const validationMessage = await petInput
    .locator("..")
    .locator(".help-block")
    .textContent();
  expect(validationMessage).toEqual("Name is required");

  await page.getByRole("button", { name: "Cancel" }).click();

  await expect(page.locator("h2")).toHaveText("Pet Types");
});
