import { test, expect } from '@playwright/test';
import { PageManager } from '../page-objects/pageManager';
import owners from '../test-data/owners.json'
import specialties from '../test-data/specialties.json'


test.beforeEach(async ({ page }) => {
    // await page.route('*/**/api/owners', async route => {

    //   await route.fulfill({
    //     body: JSON.stringify(owners)
    //   })
    // })
    // await page.route(`*/**/api/owners/${owners[0].id}`, async route => {

    //   await route.fulfill({
    //     body: JSON.stringify(owners[0])
    //   })
    // })

    await page.goto("/");
})

test('Delete specialty validation', async ({ page, request }) => {
    const specialtiesResponse = await request.post('https://petclinic-api.bondaracademy.com/petclinic/api/specialties', {
        headers: {
            Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        },
        data: { "name": "api testing expert" }
    })
    expect(specialtiesResponse.status()).toEqual(201)

    const pm = new PageManager(page)
    await pm.navigateTo().specialtiesPage()
    await pm.onSpecialtiesPage().validateLastAddedSpecialtyByName('api testing expert')
    await pm.onSpecialtiesPage().deleteLastSpecialty()
    await pm.onSpecialtiesPage().validateLastAddedSpecialtyByNameIsDeleted('api testing expert')

})
