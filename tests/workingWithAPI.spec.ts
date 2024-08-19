import { test, expect } from '@playwright/test';
import { PageManager } from '../page-objects/pageManager';
import owners from '../test-data/owners.json'

test.beforeEach(async ({ page }) => {
  await page.route('*/**/api/owners', async route => {

    await route.fulfill({
      body: JSON.stringify(owners)
    })
  })
  await page.route(`*/**/api/owners/${owners[0].id}`, async route => {

    await route.fulfill({
      body: JSON.stringify(owners[0])
    })
  })

  await page.goto("/");
  const pm = new PageManager(page)
  await pm.navigateTo().ownersPage()
})

test('mocking API request', async ({ page }) => {
  const pm = new PageManager(page)
  await expect(page.locator('.ownerFullName')).toHaveCount(2)
  await pm.onOwnersPage().openOwnerInfoPageFor(`${owners[0].firstName} ${owners[0].lastName}`)
  await pm.onOwnerInformationPage().validatePhoneAndFirstPetName(`${owners[0].telephone}`, `${owners[0].pets[0].name}`)
  await pm.onOwnerInformationPage().validatePetTypeByName(`${owners[0].pets[0].name}`, `${owners[0].pets[0].type.name}`)
  await pm.onOwnerInformationPage().validatePetTypeByName(`${owners[0].pets[1].name}`, `${owners[0].pets[1].type.name}`)
  await expect(await pm.onOwnerInformationPage().returnTotalVisit(`${owners[0].pets[0].name}`)).toHaveCount(10)
})