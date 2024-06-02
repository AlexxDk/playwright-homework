import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("Update pet type", async ({ page }) => {
  await page.getByText(" Pet Types").click();
  const tableTitle = await page.locator("h2").textContent();
  expect(tableTitle).toEqual("Pet Types");

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
