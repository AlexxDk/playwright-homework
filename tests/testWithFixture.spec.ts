import { test } from "../test-option";

test('test with fixture', async ({ ownerWithPetAndVisitSetup, pageManager }) => {
    const { petName, visitDescription } = ownerWithPetAndVisitSetup;
    await pageManager.onOwnerInformationPage().deleteVisitForPet(petName, visitDescription)
    await pageManager.onOwnerInformationPage().deletePetByName(petName)
})
