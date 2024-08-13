import { Page, test } from "@playwright/test";
import { NavigationPage } from "./navigationPage";
import { VeterinariansPage } from "./veterinariansPage";
import { SpecialtiesPage } from "./specialtiesPage";
import { PetTypesPage } from "./petTypesPage";
import { OwnerInformationPage } from "./ownerInformationPage";
import { OwnersPage } from "./ownersPage";
import { PetDetailsPage } from "./petDetailsPage";

export class PageManager {
    private readonly page: Page
    private readonly navigationPage: NavigationPage
    private readonly veterinariansPage: VeterinariansPage
    private readonly specialtiesPage: SpecialtiesPage
    private readonly petTypesPage: PetTypesPage
    private readonly ownerInformationPage: OwnerInformationPage
    private readonly ownersPage: OwnersPage
    private readonly petDetailsPage: PetDetailsPage

    constructor(page: Page) {
        this.page = page
        this.navigationPage = new NavigationPage(this.page)
        this.veterinariansPage = new VeterinariansPage(this.page)
        this.specialtiesPage = new SpecialtiesPage(this.page)
        this.petTypesPage = new PetTypesPage(this.page)
        this.ownerInformationPage = new OwnerInformationPage(this.page)
        this.ownersPage = new OwnersPage(this.page)
        this.petDetailsPage = new PetDetailsPage(this.page)
    }

    navigateTo(){
        return this.navigationPage
    }

    onVeterinariansPage(){
        return this.veterinariansPage
    }

    onSpecialtiesPage(){
        return this.specialtiesPage
    }

    onPetTypesPage(){
        return this.petTypesPage
    }

    onOwnerInformationPage(){
        return this.ownerInformationPage
    }

    onOwnersPage(){
        return this.ownersPage
    }

    onPetDetailsPage(){
        return this.petDetailsPage
    }
}