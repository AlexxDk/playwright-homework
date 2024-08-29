import {faker} from '@faker-js/faker'

export class TestDataGeneration {

    randomOwnerName(){
        return faker.person.fullName()
    }

    randomOwnerAddress(){
        return faker.location.streetAddress({ useFullAddress: true })
    }

    randomOwnerCity(){
        return faker.location.city()
    }

    randomOwnerPhoneNumber(){
        return faker.phone.number()
    }

    randomPetName(){
        return faker.animal.cat()
    }

    randomVeterinariansName(){
        return faker.person.fullName()
    }

    randomDescriptionForThePetVisit(){
        return faker.lorem.sentence(5)
    }
}