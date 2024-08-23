import { test, expect } from '@playwright/test';
import { PageManager } from '../page-objects/pageManager';


test.beforeEach(async ({ page }) => {
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
    await pm.onEditVeterinariansPage().updateSpecialtyTo('dentistry')
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

test('New specialty is displayed', async ({ page, request }) => {
    const specialtiesResponse = await request.post('https://petclinic-api.bondaracademy.com/petclinic/api/specialties', {
        headers: {
            Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        },
        data: { "name": "api testing ninja" }
    })
    const specialtiesResponseBody = await specialtiesResponse.json()
    const specialtyId = specialtiesResponseBody.id
    expect(specialtiesResponse.status()).toEqual(201)

    const getSpecialtiesResponse = await request.get('https://petclinic-api.bondaracademy.com/petclinic/api/specialties', {
        headers: {
            Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        }
    })
    const getSpecialtiesResponseBody = await getSpecialtiesResponse.json()
    const getSpecialty = getSpecialtiesResponseBody.find(spec => { return spec.name == 'surgery' })
    expect(getSpecialtiesResponse.status()).toEqual(200)

    const vetsResponse = await request.post('https://petclinic-api.bondaracademy.com/petclinic/api/vets', {
        headers: {
            Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        },
        data: { "id": null, "firstName": "Mikelangelo", "lastName": "Smith", "specialties": [{ id: `${getSpecialty.id}`, name: `${getSpecialty.name}` }] }
    })
    expect(vetsResponse.status()).toEqual(201)
    const vetsResponseBody = await vetsResponse.json()
    const vetsId = vetsResponseBody.id

    const pm = new PageManager(page)
    await pm.navigateTo().veterinariansPage()
    await pm.onVeterinariansPage().validateSpecialtyForVeterinarian('Mikelangelo Smith', 'surgery')
    await pm.onVeterinariansPage().selectEditVetByName('Mikelangelo Smith')
    await pm.onEditVeterinariansPage().updateSpecialtyTo('api testing ninja')
    await pm.onVeterinariansPage().validateSpecialtyForVeterinarian('Mikelangelo Smith', 'api testing ninja')

    const deleteVetsResponse = await request.delete(`https://petclinic-api.bondaracademy.com/petclinic/api/vets/${vetsId}`, {
        headers: {
            Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        }
    })
    expect(deleteVetsResponse.status()).toEqual(204)

    const deleteSpecialtyResponse = await request.delete(`https://petclinic-api.bondaracademy.com/petclinic/api/specialties/${specialtyId}`, {
        headers: {
            Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
        }
    })
    expect(deleteSpecialtyResponse.status()).toEqual(204)

    await pm.navigateTo().specialtiesPage()
    await pm.onSpecialtiesPage().validateLastAddedSpecialtyByNameIsDeleted('api testing ninja')
})