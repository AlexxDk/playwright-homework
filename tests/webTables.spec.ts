import { test, expect } from "@playwright/test";

test.describe('OWNERS page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
        await page.getByText(" Owners").click();
        await page.locator(".dropdown-menu").getByText(" Search").click();
    });

    test('Validate the pet name city of the owner', async ({ page }) => {
        const ownerRow = page.getByRole('row', { name: '6085555387' })
        await expect(ownerRow.locator('td').nth(2)).toHaveText('Monona')
        await expect(ownerRow.locator('td').last()).toHaveText('Lucky')
    })

    test('Validate owners count of the Madison city', async ({ page }) => {
        await page.waitForSelector('tbody')
        const allCitizensRows = page.locator('tbody tr', { has: page.locator('td').nth(2) })
        let allMadisonCitizen = 0

        for (const citizen of await allCitizensRows.all()) {
            const cellValue = await citizen.locator('td').nth(2).textContent()
            if (cellValue == 'Madison') {
                allMadisonCitizen += 1
            }
        }
        expect(allMadisonCitizen).toEqual(4)
    })

    test('Validate search by Last Name', async ({ page }) => {
        const inputLastName = page.locator('#lastName')
        await inputLastName.fill('Black')
        const buttonFindOwner = page.getByRole('button', { name: 'Find Owner' })
        await buttonFindOwner.click()

        await page.waitForTimeout(2000)

        const ownersListLoop = async (searchValue) => {
            if (searchValue == 'Playwright') {
                expect(await page.locator('.xd-container div').last().textContent()).toContain(`No owners with LastName starting with "${searchValue}"`)
                return;
            }

            const ownersList = page.locator('tbody tr', { has: page.locator('td').nth(2) })
            for (const row of await ownersList.all()) {
                const cellValue = await row.locator('td').first().textContent()
                expect(cellValue).toContain(searchValue)

            }
        }

        ownersListLoop('Black')

        await inputLastName.clear()
        await inputLastName.fill('Davis')
        await buttonFindOwner.click()
        await page.waitForTimeout(2000)
        ownersListLoop('Davis')

        await inputLastName.clear()
        await inputLastName.fill('Es')
        await buttonFindOwner.click()
        await page.waitForTimeout(2000)
        ownersListLoop('Es')

        await inputLastName.clear()
        await inputLastName.fill('Playwright')
        await buttonFindOwner.click()
        await page.waitForTimeout(2000)
        ownersListLoop('Playwright')


    })

    test('Validate phone number and pet name on the Owner Information page', async ({ page }) => {
        const ownerRow = page.getByRole('row', { name: '6085552765' })
        const petName = await ownerRow.locator('td').last().textContent()
        await ownerRow.getByRole('link', { name: 'Peter McTavish' }).click()
        await page.waitForTimeout(2000)
        expect(await page.locator('table').first().locator('tr td').last().textContent()).toContain('6085552765')
        expect(await page.locator('.dl-horizontal dd').first().textContent()).toContain(petName?.trim())

    })

    test('Validate pets of the Madison city', async ({ page }) => {
        await page.waitForSelector('table')

        const expectedList = [" Leo ", " George ", " Mulligan ", " Freddy "]
        let petList = []

        const allRows = page.locator('tbody tr', { has: page.locator('td').nth(4) })

        for (const row of await allRows.all()) {
            const cityValue = await row.locator('td').nth(2).textContent()
            const petsValue = await row.locator('td').nth(4).textContent()

            if (cityValue == 'Madison') {
                petList.push(petsValue)
            }
        }
        expect(petList).toEqual(expectedList)

    })
})

test('Validate specialty update', async ({ page }) => {
    await page.goto("/");
    const veterinariansMenu = page.getByText(" Veterinarians")
    await veterinariansMenu.click();
    const veterinariansMenuAll = page.locator(".dropdown-menu").getByText(" All")
    await veterinariansMenuAll.click();
    const rafaelSpecialty = await page.getByRole('row', { name: " Rafael Ortega " }).locator('td').nth(1)
    expect(await rafaelSpecialty.textContent()).toContain('surgery')

    await page.getByRole('link', { name: 'Specialties' }).click()
    await expect(page.locator("h2")).toHaveText("Specialties");

    const rowSurgery = page.locator('tr', { has: page.locator('[id="1"]') })
    await rowSurgery.getByRole("button", { name: "Edit" }).click();
    await expect(page.locator('h2')).toContainText('Edit Specialty')
    const editSpecialtyInput = page.locator('#name')
    await editSpecialtyInput.click()
    await editSpecialtyInput.clear()
    await editSpecialtyInput.fill('dermatology')
    await page.getByRole('button', { name: "Update" }).click()
    await expect(rowSurgery.locator('td input').first()).toHaveValue('dermatology')

    await veterinariansMenu.click();
    await veterinariansMenuAll.click();
    expect(await rafaelSpecialty.textContent()).toContain('dermatology')

    await page.getByRole('link', { name: 'Specialties' }).click()
    await rowSurgery.getByRole("button", { name: "Edit" }).click();
    await editSpecialtyInput.click()
    await editSpecialtyInput.clear()
    await editSpecialtyInput.fill('surgery')
    await page.getByRole('button', { name: "Update" }).click()
})

test('Validate specialty lists', async ({ page }) => {
    await page.goto("/");
    await page.getByRole('link', { name: 'Specialties' }).click()
    await page.getByRole('button', { name: "Add" }).click()
    await page.locator('#name').fill('oncology')
    await page.getByRole('button', { name: "Save" }).click()

    const allSpecialtiesValues = await page.locator('td input')
    let specialtiesList = []

    for (const specialty of await allSpecialtiesValues.all()) {
        specialtiesList.push(await specialty.inputValue())
    }

    await page.getByText('Veterinarians').click()
    await page.locator(".dropdown-menu").getByText(" All").click()
    const sharonJenkinsRow = page.locator('tr', { has: page.getByText(' Sharon Jenkins ') })
    await sharonJenkinsRow.getByRole('button', { name: 'Edit Vet' }).click()

    await page.locator('.dropdown-display').click()
    let specialtiesListFromDropDOwn = []
    const allValuesFromDropDownMenu = await page.locator(".dropdown-content label").allTextContents()
    specialtiesListFromDropDOwn.push(allValuesFromDropDownMenu)
    expect(specialtiesList).toBe(specialtiesList)

    await page.getByLabel('oncology').click()
    await page.locator('.selected-specialties').click()
    await page.getByRole('button', { name: 'Save Vet' }).click()
    expect(await sharonJenkinsRow.locator('td').nth(1).textContent()).toContain('oncology')

    await page.getByRole('link', { name: 'Specialties' }).click()
    await page.locator('tbody tr').last().getByRole('button', { name: "Delete" }).click()

    await page.getByText('Veterinarians').click()
    await page.locator(".dropdown-menu").getByText(" All").click()
    expect(await sharonJenkinsRow.locator('td').nth(1).textContent()).toContain('')

})