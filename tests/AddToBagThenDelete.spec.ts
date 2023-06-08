import test from "@playwright/test";
import { HomePage } from "../models/HomePage";
import { ResultPage } from "../models/ResultPage";
import { SelectedItemPage } from "../models/SelectedItemPage";
import { CheckoutPage } from "../models/CheckoutPage";

test('Add to bag then delete', async({page}) =>{
    const home = new HomePage(page);
    const result = new ResultPage(page);
    const item = new SelectedItemPage(page);
    const checkout = new CheckoutPage(page);

    await home.GoToHomePage();

    await home.HoverStoreAndSelect("Menu");

    var selectedItem =  await result.GetAndSelectItem(2);

    await item.ValidateSelectedItem(selectedItem);

    // Choose sizes from 2 - 9
    await item.SelectSize('2');

    await item.ClickAddToBagThenValidate(selectedItem);

    await item.ClickCheckout();

    await checkout.ValidateCheckoutItem(selectedItem);

    await checkout.ClickDeleteButton();

    await checkout.ValidateCheckoutItem();

})