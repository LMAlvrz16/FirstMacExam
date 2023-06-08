import { errors, Page } from "@playwright/test";
import { Common } from "./Common";

export class ResultPage extends Common{
    // Set page object variable.
    readonly page: Page;

    // Set a sub routine that will access the functions from parent and sibling class.
    constructor(page: Page){
        super(page);
        this.page = page;
    }

    private Elements = {
        searchItems: "//div[@id='scroll-frame']/div[2]/div",
        resultsProductID: "xpath=child::a/div/div/picture/img",
        resultsProductName: 'xpath=child::a/div[2]/div/h2',
        resultsProductDescription: 'xpath=child::a/div[2]/h2/span',
        resultsProductOGPrice: 'xpath=child::div/span/span[1]/span',
        resultsProductDiscountedPrice: 'xpath=child::div/span/span[2]/span',
    }

    async GetAndSelectItem(selectItem: number){
        var selectedItem: any [] = [];
        var items = await this.FindElements(this.Elements.searchItems, "Search Results");
        for(var i = 0; i<items.length; i++){
            if( selectItem == i){
                var productIDElement = await this.FindSubElementOnElement(items[i], this.Elements.resultsProductID, "Product ID Element");
                var productNameElement = await this.FindSubElementOnElement(items[i], this.Elements.resultsProductName, "Product Name Element");
                var productDescriptionElement = await this.FindSubElementOnElement(items[i], this.Elements.resultsProductDescription, "Product Name Element");
                var productOrigPriceElement = await this.FindSubElementOnElement(items[i], this.Elements.resultsProductOGPrice, "Product Name Element");
                var productDiscountedPriceElement = await this.FindSubElementOnElement(items[i], this.Elements.resultsProductDiscountedPrice, "Product Name Element");
                var productID = await this.GetElementValueByAttribute(productIDElement, 'data-product-id', 'Product ID');
                var productName = await this.GetLiveElementText(productNameElement, "Product Name");
                var productDescription = await this.GetLiveElementText(productDescriptionElement, "Product Name");
                var productOrigPrice = await this.GetLiveElementText(productOrigPriceElement, "Product Name");
                var productDoscountedPrice = await this.GetLiveElementText(productDiscountedPriceElement, "Product Name");
                selectedItem.push(productID);
                selectedItem.push(productName);
                selectedItem.push(productDescription);
                selectedItem.push(productOrigPrice);
                selectedItem.push(productDoscountedPrice);
                await this.ClickElement(productNameElement, "Item");
            }
        }
        return selectedItem;
    }




}