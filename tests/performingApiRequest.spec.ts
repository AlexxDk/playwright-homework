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

test('Add and delete veterinarian', async ({ page, request }) => {
    const vetsResponse = await request.post('https://petclinic-api.bondaracademy.com/petclinic/api/vets', {
        headers: {
            Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        },
        data: { "id": null, "firstName": "Donatello", "lastName": "Smith", "specialties": [] }
    })
    const responseBody = await vetsResponse.json()
    const id = responseBody.id
    const firstName = responseBody.firstName
    expect(vetsResponse.status()).toEqual(201)
    expect(firstName).toEqual('Donatello')

    const pm = new PageManager(page)
    await pm.navigateTo().veterinariansPage()
    await pm.onVeterinariansPage().validateSpecialtyForVeterinarian('Donatello Smith', 'empty')
    await pm.onVeterinariansPage().selectEditVetByName('Donatello Smith')
    await pm.onEditVeterinariansPage().addSpecialty('dentistry')
    await pm.onVeterinariansPage().validateSpecialtyForVeterinarian('Donatello Smith', 'dentistry')

    const deleteVetsResponse = await request.delete(`https://petclinic-api.bondaracademy.com/petclinic/api/vets/${id}`, {
        headers: {
            Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        }
    })
    expect(deleteVetsResponse.status()).toEqual(204)

    const getVetsResponse = await request.get('https://petclinic-api.bondaracademy.com/petclinic/api/vets', {
        headers: {
            Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        }
    })
    const responseVetsBody = await getVetsResponse.json()
    expect(responseVetsBody.every(vet => {
        return vet.firstName !== 'Donatello' && vet.lastName !== 'Smith'
    })).toBe(true)
})