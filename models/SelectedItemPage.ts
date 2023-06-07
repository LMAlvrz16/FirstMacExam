import { errors, Page } from "@playwright/test";
import { Common } from "./Common";

export class SelectedItemPage extends Common{
    // Set page object variable.
    readonly page: Page;

    // Set a sub routine that will access the functions from parent and sibling class.
    constructor(page: Page){
        super(page);
        this.page = page;
    }
}