import { test, expect } from '@playwright/test';
import { PageManager } from '../page-objects/pageManager';
import owners from '../test-data/owners.json'
import specialties from '../test-data/specialties.json'

test.describe('owners page', async () => {
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
    await pm.onOwnerInformationPage().validateVisitCountByPetName(`${owners[0].pets[0].name}`, 10)
  })
})

test.describe('veterinarians page', async () => {
  test.beforeEach(async ({ page }) => {
    await page.route('*/**/api/vets', async route => {
      const response = await route.fetch()
      const responseBody = await response.json()
      responseBody.map(veterinarian => {
        if (veterinarian.firstName == 'Sharon' && veterinarian.lastName == 'Jenkins') {
          veterinarian.specialties = specialties
        }
      })

      await route.fulfill({
        body: JSON.stringify(responseBody)
      })
    })

    await page.goto("/");
    const pm = new PageManager(page)
    await pm.navigateTo().veterinariansPage()
  })

  test('intercept api response', async ({ page }) => {
    const pm = new PageManager(page)
    await pm.onVeterinariansPage().validateSpecialtiesCountByVeterinarianName('Sharon Jenkins', 10)
  })
})
