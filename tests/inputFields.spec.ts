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

  const petTypeInput = page.locator('[name="name"]');
  await petTypeInput.clear();
  await petTypeInput.pressSequentially('rabbit', {delay: 500});
  await page.getByRole('button', {name: 'Update'}).click()
  
  const firstPetTypeInTable = page.locator('td', {has: page.locator('[name="pettype_name"]')}).first()
  await expect(firstPetTypeInTable).toHaveValue('rabbit')
});
