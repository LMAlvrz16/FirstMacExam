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
        featuredDesigners: '//nav/ul/li[7]/div/section/div[4]/div/div[2]/ul/li',
        featuredDesignersName: 'xpath=child::a',
        navBarName: 'xpath=child::div/a/span',
        narBarSection: 'xpath=child::div/section/div',
        navBarMenuTitle: 'xpath=child::div/div/h6',
        navBarMenu: 'xpath=child::div/div/ul/li/a',
    }

    async GoToHomePage(){
        await this.GoTo(URL.main, "Home Page");
        var url = await this.page.url();
        expect(url).toEqual(URL.main);
    }

    async HoverStoreAndSelect(navBar: string){
        // This will find all the nav bar elements and it is dynamic if you want to hover other navigation bar
        var designersName: any [] = [];
        var designersLink: any [] = [];
        var navBars = await this.FindElements(this.Elements.navBarName, "Nav Bars");
        for(var i = 0; i<navBars.length; i++){
            var navBarNameElement = await this.FindSubElementOnElement(navBars[i], this.Elements.navBarName, "Nav Bar Element");
            var navBarName = await this.GetLiveElementText(navBarNameElement, "Nav Bar Name");
            if(navBarName.toLowerCase() == navBar.toLowerCase()){
                await this.ElementHover(this.Elements.navBarName, "");
                //this will store all the featured designers
                var featuredDesigners = await this.FindElements(this.Elements.featuredDesigners, "Featured Designer");
                for(var i = 0; i<featuredDesigners.length; i++){
                    var featuredDesignersElements = await this.FindSubElementOnElement(featuredDesigners[i], this.Elements.featuredDesignersName, "Featured Designers Elements")
                    var featuredDesignerName = await this.GetLiveElementText(featuredDesignersElements, "Featured Designers Name");
                    designersName.push(featuredDesignerName);
                }
                await this.ClickElement(featuredDesigners[0], "");
            }
        }
    }
} 