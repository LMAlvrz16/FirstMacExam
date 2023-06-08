import { errors, Page, expect } from "@playwright/test";
import { Common } from "./Common";

export class SelectedItemPage extends Common{
    // Set page object variable.
    readonly page: Page;

    // Set a sub routine that will access the functions from parent and sibling class.
    constructor(page: Page){
        super(page);
        this.page = page;
    }

    private Elements = {
        selectedItemProductID: "//div[@id='mainContent']/main/div[2]/div",
        selectedItemProductName: '//div/h1/a',
        selectedItemProductDescription: '//div/h1/span',
        selectedItemProductOGPrice: "//div[@data-test='pdp-pricing']/div[1]/span[1]",
        selectedItemProductDiscounterPrice: "//div[@data-test='pdp-pricing']/div[1]/span[2]",
        addToBagBtn: "//button[text()='Add To Bag']",
        sizeDrp: "//div[@data-test='pdp-size-selector']",
        sizes: "//div/ul[@role='listbox']/li[X]/span",
        checkoutModal: "//div[@id='cartlinkspandivgutter']",
        checkoutProductTbl: "//table[@class='table-checkout-menu']/tbody/tr/td",
        checkoutProduct: 'xpath==child::p/b/a',
        checkoutBtnModal: "//button[@id='miniCartButton']",
        checkoutBtn: "//a[@id='lbl_easycarheader_bottom']",
    }

    async ValidateSelectedItem(expectedSelectedItem: any [] = []){
        var actualSelectedItem: any [] = [];
        var productID = await this.GetElementText(this.Elements.selectedItemProductID, "Product ID");
        var productName = await this.GetElementText(this.Elements.selectedItemProductName, "Product Name");
        var productDescription = await this.GetElementText(this.Elements.selectedItemProductDescription, "Product Description");
        var productOrigPrice = await this.GetElementText(this.Elements.selectedItemProductOGPrice, "Product Orig Price");
        var productDiscountedPrice = await this.GetElementText(this.Elements.selectedItemProductDiscounterPrice, "Product Discounted Price");
        actualSelectedItem.push(productID);
        actualSelectedItem.push(productName);
        actualSelectedItem.push(productDescription);
        actualSelectedItem.push(productOrigPrice);
        actualSelectedItem.push(productDiscountedPrice);

        //This will validate product details
        for(var i = 0; i<expectedSelectedItem.length; i++){
            expect(actualSelectedItem[i]).toEqual(expectedSelectedItem);
        }
    }

    async SelectSize(size: string){
        await this.Click(this.Elements.sizeDrp, "Sizes");
        await this.Click(this.Elements.sizes.replace('X',size), "Size")
    }

    async ClickAddToBagThenValidate(selectedItem: any [] = []){
        var ctr = 0;
        await this.Click(this.Elements.addToBagBtn, "Add to bag button");
        await this.WaitForElement(this.Elements.checkoutModal, "Checkout Modal");
        var checkoutProductTbl = await this.FindElements(this.Elements.checkoutProductTbl, "Checkout Table");
        var checkoutProductName: any [] = [];
        
        //This will get the product(s) name in the checkout modal
        for(var i = 0; i<checkoutProductTbl.length; i++){
            var checkoutProductElements = await this.FindSubElementOnElement(checkoutProductTbl[i], this.Elements.checkoutProduct, "Checkout Product");
            var productName = await this.GetLiveElementText(checkoutProductElements, "Product Name")
            checkoutProductName.push(productName);
            ctr++;
        }
        //This will validate the selected item into checkout/added item. I did a for loop just to make it dynamic
        for(var i = 0; i<selectedItem.length; i++){
            expect(selectedItem[i]).toContainEqual(checkoutProductName[i])
        }
        // This will verify the count '1' in Checkout
        var numberOfCheckOut = await this.GetElementText(this.Elements.checkoutBtnModal, "Checkout");
        expect(ctr.toString()).toEqual(numberOfCheckOut.split(" ")[1])
        
    }

    async ClickCheckout(){
        await this.Click(this.Elements.checkoutBtn, "Checkout Button");
    }
}