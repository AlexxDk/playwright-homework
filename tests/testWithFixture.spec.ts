import { test } from "../test-option";

test('test with fixture', async ({ pageManager }) => {
    await pageManager.onOwnerInformationPage().deleteVisitForPet('petname', 'firstRandomDescriptionForThePetVisit')
})
