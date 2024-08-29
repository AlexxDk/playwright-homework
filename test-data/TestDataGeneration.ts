import { faker } from '@faker-js/faker'

export class TestDataGeneration {

    static randomOwnerFirstName(): string {
        return faker.person.firstName()
    }

    static randomOwnerLastName(): string {
        return faker.person.lastName()
    }

    static randomOwnerAddress(): string {
        return faker.location.streetAddress({ useFullAddress: true })
    }

    static randomOwnerCity(): string {
        return faker.location.city()
    }

    static randomOwnerPhoneNumber(): string {
        return faker.phone.number('##########')
    }

    static randomPetName(): string {
        return faker.animal.cat()
    }

    static randomDescriptionForThePetVisit(): string {
        return faker.lorem.sentence(5)
    }

    static randomSpecialtyName(): string {
        return faker.commerce.department()
    }
}