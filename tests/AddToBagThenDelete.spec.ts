import test from "@playwright/test";
import { HomePage } from "../models/HomePage";
import { ResultPage } from "../models/ResultPage";
import { SelectedItemPage } from "../models/SelectedItemPage";

test('Add to bag then delete', async({page}) =>{
    
    const home = new HomePage(page);
    const result = new ResultPage(page);
    const item = new SelectedItemPage(page);

    await home.GoToHomePage();

    await home.SelectAndHoverFromNavBar("Menu");
})