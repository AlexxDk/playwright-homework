import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");

  await page.getByText(" Pet Types").click();
  const tableTitle = await page.locator("h2").textContent();
  expect(tableTitle).toEqual("Pet Types");
});

test("Update pet type", async ({ page }) => {
  const tableRows = page.locator("tbody tr");
  await page.waitForSelector('[id="0"]');
  for (let row of await tableRows.all()) {
    const cellValue = await row.locator("input").inputValue();
    if (cellValue === "cat") {
      await row.getByRole("button", { name: "Edit" }).click();
      break;
    }
  }

  await expect(page.locator("h2")).toHaveText("Edit Pet Type");

  const petTypeInput = page.locator("#name");
  await petTypeInput.click();
  await petTypeInput.clear();

  //   await page.waitForTimeout(5000);
  await petTypeInput.fill("rabbit");
  await page.getByRole("button", { name: "Update" }).click();

  await page.waitForSelector('[id="0"]');
  const firstPetTypeInTable = page
    .locator('input[name="pettype_name"]')
    .first();
  await expect(firstPetTypeInTable).toHaveValue("rabbit");

  for (let row of await tableRows.all()) {
    const cellValue = await row.locator("input").inputValue();
    if (cellValue === "rabbit") {
      await row.getByRole("button", { name: "Edit" }).click();
      break;
    }
  }
  await petTypeInput.click();
  await petTypeInput.clear();
  await petTypeInput.fill("cat");
  await page.getByRole("button", { name: "Update" }).click();

  await expect(firstPetTypeInTable).toHaveValue("cat");
});

test("Cancel pet type update", async ({ page }) => {
  const tableRows = page.locator("tbody tr");
  await page.waitForSelector('[id="0"]');
  for (let row of await tableRows.all()) {
    const cellValue = await row.locator("input").inputValue();
    if (cellValue === "dog") {
      await row.getByRole("button", { name: "Edit" }).click();
      break;
    }
  }

  const petTypeInput = page.locator("#name");
  await petTypeInput.click();
  await petTypeInput.clear();
  await petTypeInput.fill("moose");

  await expect(petTypeInput).toHaveValue("moose");

  await page.getByRole("button", { name: "Cancel" }).click();

  await page.waitForSelector('[id="0"]');
  const secondPetTypeInTable = page
    .locator('input[name="pettype_name"]')
    .nth(1);
  await expect(secondPetTypeInTable).toHaveValue("dog");
});

test("Pet type name is required validation", async ({ page }) => {
  const tableRows = page.locator("tbody tr");
  await page.waitForSelector('[id="0"]');
  for (let row of await tableRows.all()) {
    const cellValue = await row.locator("input").inputValue();
    if (cellValue === "lizard") {
      await row.getByRole("button", { name: "Edit" }).click();
      break;
    }
  }

  const petTypeInput = page.locator("#name");
  await petTypeInput.click();
  await petTypeInput.clear();

  const validationMessage = await petTypeInput
    .locator("..")
    .locator(".help-block")
    .textContent();
  expect(validationMessage).toEqual("Name is required");

  await page.getByRole("button", { name: "Cancel" }).click();

  const tableTitle = await page.locator("h2").textContent();
  expect(tableTitle).toEqual("Pet Types");
});
