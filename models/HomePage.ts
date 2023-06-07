import { errors, expect, Page } from "@playwright/test";
import { Common } from "./Common";
import { URL } from "../data/users";

export class HomePage extends Common{
    // Set page object variable.
    readonly page: Page;

    // Set a sub routine that will access the functions from parent and sibling class.
    constructor(page: Page){
        super(page);
        this.page = page;
    }



    private Elements = {
        modal: '#modal',
        modalXBtn: '#closeButton',
        navBar: '//nav/ul/li',
        navBarName: 'xpath=child::div/a/span',
        narBarSection: 'xpath=child::div/section/div',
        navBarMenuTitle: 'xpath=child::div/div/h6',
        navBarMenu: 'xpath=child::div/div/ul/li/a',
        searchItems: "//div[@id='scroll-frame']/div[2]/div",
        resultsProductID: '',
        resultsProductName: 'xpath=child::/a/div[2]/div/h2',
        resultsProductDescription: 'xpath=child::a/div[2]/h2/span',
        resultsProductOGPrice: 'xpath=child::div/span/span[1]/span',
        resultsProductDiscountedPrice: 'xpath=child::div/span/span[2]/span',
        selectedItemProductID: '',
        selectedItemProductName: '//div/h1/a',
        selectedItemProductDescription: '//div/h1/span',
        selectedItemProductOGPrice: "//div[@data-test='pdp-pricing']/div[1]/span[1]",
        selectedItemProductDiscounterPrice: "//div[@data-test='pdp-pricing']/div[1]/span[2]",
        addToBagBtn: "//button[text()='Add To Bag']",
    }

    async GoToHomePage(){
        await this.GoTo(URL.main, "Home Page");
        
        
    }

    async SelectAndHoverFromNavBar(navigateTo: string){
        var navBars = await this.FindElements(this.Elements.navBarName, "Nav Bars");
        for(var i = 0; i<navBars.length; i++){
            var navBarNameElement = await this.FindSubElementOnElement(navBars[i], this.Elements.navBarName, "Nav Bar Element");
            var navBarName = await this.GetLiveElementText(navBarNameElement, "Nav Bar Name");
            if(navBarName.toLowerCase() == navigateTo.toLowerCase()){
                await this.ElementHover(this.Elements.navBar, "");
            }
        }
        
    }
}