import { errors, Page, expect } from "@playwright/test";
import { Common } from "./Common";

export class CheckoutPage extends Common{
    // Set page object variable.
    readonly page: Page;

    // Set a sub routine that will access the functions from parent and sibling class.
    constructor(page: Page){
        super(page);
        this.page = page;
    }

    private Elements = {
        itemName: "//div[@class='itemName grid-100']/a",
        itemsInYourBag: "//div[@class='grid-100']",
        deleteBtn: "//div/button[text()='X']",
        noItems: "//div[@class='grid-70']/div",
        numberOfItems: '//div[@class="item grid-100 tablet-grid-100 mobile-grid-100"]',
    }

    async ValidateCheckoutItem(selectedItem: any [] = []){
        var items = await this.FindElements(this.Elements.numberOfItems, "Items");
        if(items.length >= 1){
            var itemName = await this.GetElementText(this.Elements.itemName, "item Name");
            var itemsInYourBag = await this.GetElementText(this.Elements.itemsInYourBag, "Items in your bag");
            expect(selectedItem[0]).toBe(itemName);
            expect(itemsInYourBag).toBe('1 items in your bag');
        }else{
            await this.ElementExist(this.Elements.noItems);
        }
    }

    async ClickDeleteButton(){
        await this.Click(this.Elements.deleteBtn, "Delete Button");
    }

}