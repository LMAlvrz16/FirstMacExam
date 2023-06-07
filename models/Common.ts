import { ElementHandle, Page } from "@playwright/test";
import { errors } from "@playwright/test";
import fs from 'fs';

export class Common{
    // Set global object variable.
    readonly page: Page;

    // Set a sub routine that will access the functions from parent and sibling class.
    constructor(page: Page){
        this.page = page;
    }

    // This will navigate to the specified URL.
    async GoTo(url: string, pageName: string){
        try{
            await this.page.goto(url, {timeout: 90000});
        }
        catch(e){
            if(e instanceof errors.TimeoutError){
                throw new Error("Unable to load the " + pageName+ ".\nMessage: " + e.message);
            }
        }
    }

    // Set thread sleep.
    async Sleep(ms: number){
        const promise = await new Promise(resolve => setTimeout(resolve, ms));
        return promise;
    }

    // // Capture browser screen.
    // async ScreenShot(fileName: string, testResult: boolean = true, error: string = ""){
    //     var counter: any;
    //     // remove spaces in file name.
    //     await this.Sleep(1000);
    //     do{
    //         fileName = fileName.replace(" ", "");
    //     }while(fileName.includes(" "));

    //     // This will get the current number of image saved in the directory.
    //     if(fs.existsSync(this.testDirectory.PassedDirectory)){
    //         counter = fs.readdirSync(this.testDirectory.PassedDirectory).length;
    //         counter = counter + 1;
    //     }
    //     else{
    //         counter =  1;
    //     }

    //     // Save the screenshot in Passed directory if the script passed and Failed directory if NOT.
    //     if(testResult){
    //         await this.page.screenshot({ path: this.testDirectory.PassedDirectory + "/" + counter + "_" + 
    //         fileName.replace(" ", "").trim() + ".png" });
    //     }
    //     else{
    //         try{
    //             await this.Sleep(5000);
    //             fs.renameSync(this.testDirectory.PassedDirectory, this.testDirectory.FailedDirectory);
    //             await this.SaveStackTrace(error)
    //             console.log("File moved to failed directory.");
    //         }
    //         catch(err){
    //             throw new Error("Message: " + error);
    //         }
    //         await this.page.screenshot({ path: this.testDirectory.FailedDirectory + "/" + fileName.replace(" ", "").trim() + ".png" });
    //     }
    // }

    // // Capture browser screen.
    // async SaveFailedTraceLogs(error: string = ""){
    //     // Save the stack trace for failed API.
    //     try{
    //         // This will save the files to failed directory.
    //         if(!fs.existsSync(this.testDirectory.FailedDirectory)){
    //             fs.mkdirSync(this.testDirectory.PassedDirectory, {recursive: true});
    //         }
    //         fs.renameSync(this.testDirectory.PassedDirectory, this.testDirectory.FailedDirectory);
    //         await this.SaveStackTrace(error);
    //         console.log("File moved to failed directory.");
    //     }
    //     catch(err){
    //         throw new Error("Message: " + err);
    //     }
    // }

    // // Save stack trace for failed scripts.
    // async SaveStackTrace(error: any){
    //     fs.writeFileSync(this.testDirectory.FailedDirectory + "/StackTrace.txt", error);
    // }

    // // Save logs for failed scripts.
    // async SaveLogs(stringBuilder: any){
    //     fs.writeFileSync(this.testDirectory.PassedDirectory + "/Logs.txt", stringBuilder);
    // }
    
    // Wait for element to be visible.
    async WaitForElement(locator: string, locatorName: string, timeOut: number = 0){
        try{
            if(timeOut > 0){
                await this.page.waitForSelector(locator, {state: "visible", timeout: timeOut});
            }
            else{
                await this.page.waitForSelector(locator, {state: "visible", timeout: 90000});
            }
        }
        catch(e){
            if(e instanceof errors.TimeoutError){
                throw new Error("Unable to find " + locatorName + ".\nMessage: " + e.message);
            }
            else{
                throw new Error("Unable to find " + locatorName + ".\nMessage: " + e.message);
            }
        }
    }

    // This will wait for element state to be hidden.
    async WaitForElementToBeHidden(locator: string, milliSeconds: number = 0){
      try{
        if(milliSeconds > 0){
          await this.page.waitForSelector(locator, { timeout: milliSeconds, state: "hidden"});
        }
        else{
          await this.page.waitForSelector(locator, { timeout: 90000, state: 'hidden'});
        }
      }
      catch(e){
        if(e instanceof errors.TimeoutError){
          return false;
        }
        else{
          return false;
        }
      }
      return true;
    }

    // This will wait for element state to be hidden.
    async WaitForLiveElementToBeHidden(element: ElementHandle, elementName: string){
      try{
        return await element.waitForElementState("hidden", {timeout: 90000});
      }
      catch(e){
        if(e instanceof errors.TimeoutError){
            throw new Error(elementName + " was not hidden within 90 seconds");
        }
        else{
            throw new Error(elementName + " was not hidden within 90 seconds");
        }
      }
    }

    // Find a particular element.
    async FindElement(locator: string, locatorName: string, elementType: string = "Not Hidden"){
        try{
            if(elementType.toLowerCase().trim()!="hidden"){
                await this.WaitForElement(locator, locatorName, 90000);
            }
            var currentValue = await this.page.$(locator);
            console.log(locatorName + " was found.");
            if(currentValue!=null){
                var elementValue =currentValue;
                return elementValue;
            }
            else{
                throw new Error("Unable to find " + locatorName + " as element is null.");
            }

        }
        catch(e){
            if(e instanceof errors.TimeoutError){
                throw new Error("Unable to find " + locatorName + ".\nMessage: " + e.message);
            }
            else{
                throw new Error("Unable to find " + locatorName + ".\nMessage: " + e.message);
            }
        }
    }

    // Find number of elements.
    async FindElements(locator: string, locatorName: string, elementType: string = "Not Hidden"){
        try{
            if(elementType.toLowerCase().trim()!="hidden" && elementType.toLowerCase().trim()!="all"){
                await this.WaitForElement(locator, locatorName, 90000);
            }
            var currentValues = await this.page.$$(locator);
            if(currentValues!=null){
                var elementValues = currentValues;
                console.log(elementValues.length + " " + locatorName + " was found.");
                return elementValues;
            }
            else{
                throw new Error("Unable to find " + locatorName + " as element is null.");
            }
        }
        catch(e){
            if(e instanceof errors.TimeoutError){
                throw new Error("Unable to find " + locatorName + "\nMessage: " + e.message);
            }
            else{
                throw new Error("Unable to find " + locatorName + "\nMessage: " + e.message);
            }
        }
    }

    // Find number of elements.
    async FindSubElementOnElement(element: ElementHandle, locator: string, locatorName: string){
        try{
            var currentValue = await element.$(locator);
            if(currentValue!=null){
                var elementValue = currentValue;
                console.log(locatorName + " was found.");
                return elementValue;
            }
            else{
                throw new Error("Unable to find " + locatorName + " as element is null.");
            }
        }
        catch(e){
            if(e instanceof errors.TimeoutError){
                throw new Error("Unable to find " + locatorName + "\nMessage: " + e.message);
            }
            else{
                throw new Error("Unable to find " + locatorName + "\nMessage: " + e.message);
            }
        }
    }

    // Find number of elements.
    async FindSubElementsOnElement(element: ElementHandle, locator: string, locatorName: string){
        try{
            var elementValues = await element.$$(locator);
            console.log(elementValues.length + " " + locatorName + " was found.");
        }
        catch(e){
            if(e instanceof errors.TimeoutError){
                throw new Error("Unable to find " + locatorName + "\nMessage: " + e.message);
            }
            else{
                throw new Error("Unable to find " + locatorName + "\nMessage: " + e.message);
            }
        }
        return elementValues;
    }

    // Check if element exists.
    async ElementExist(locator: string, timeout: number = 0){
        var isExist = true;
        try{
            if(timeout > 0){
                await this.page.waitForSelector(locator, {state: "visible", timeout: timeout});
            }
            else{
                await this.page.waitForSelector(locator, {state: "visible", timeout: 90000});
            }
        }
        catch(e){
            if(e instanceof errors.TimeoutError){
                isExist = false;
            }
            else{
                isExist = false;
            }
        }
        return isExist;
    }

    // Check if sub-element exists.
    async SubElementExist(element: ElementHandle, locator: string, timeOut: number = 0){
        var isExist = true;
        try{
            if(timeOut > 0){
                await element.waitForSelector(locator, {state: "visible", timeout: timeOut});
            }
            else{
                await element.waitForSelector(locator, {state: "visible"});
            }
        }
        catch(e){
            if(e instanceof errors.TimeoutError){
                isExist = false;
            }
            else{
                isExist = false;
            }
        }
        return isExist
    }

    // Check if sub-element exists
    async ChildElementExist(element: ElementHandle, locator: string, timeout: number = 0){
        var isExist = true;
        try{
            if(timeout > 0){
                await element.waitForSelector(locator, {timeout: timeout, state: "attached"});
            }
            else{
                await element.waitForSelector(locator, {state: "attached"});
            }
        }
        catch(e){
            if(e instanceof errors.TimeoutError){
                isExist = false;
            }
            else{
                isExist = false;
            }
        }
        return isExist
    }

    // Check if element enabled
    async ElementEnabled(locator: string){
        var isExist = true;
        try{
            var value = await this.page.$(locator);
            if(value!=null){
                if(!value.isEnabled()){
                    isExist = false;
                }
            }
        }
        catch(e){
            if(e instanceof errors.TimeoutError){
                isExist = false;
            }
            else{
                isExist = false;
            }
        }
        return isExist
    }

    // Click element.
    async Click(locator: string, locatorName: string){
        try{
            await this.page.isEnabled(locator);
            await this.page.click(locator);
            console.log(locatorName + " was clicked.");
        }
        catch(e){
            if(e instanceof errors.TimeoutError){
                throw new Error("Unable to click " + locatorName + "\nMessage: " + e.message);
            }
            else{
                throw new Error("Unable to click " + locatorName + "\nMessage: " + e.message);
            }
        }
    }

    // Click existing element.
    async ClickElement(element: ElementHandle, locatorName: string){
        try{
            await element.click({timeout: 90000});
            console.log(locatorName + " was clicked.");
        }
        catch(e){
            if(e instanceof errors.TimeoutError){
                throw new Error("Unable to click " + locatorName + "\nMessage: " + e.message);
            }
            else{
                throw new Error("Unable to click " + locatorName + "\nMessage: " + e.message);
            }
        }
    }

    // Fill up the value into the element.
    async FillUpValue(locator: string, inputValue: string, locatorName: string){
        try{
            await this.page.fill(locator, inputValue);
        }
        catch(e){
            if(e instanceof errors.TimeoutError){
                throw new Error("Unable to fill " + locatorName + "\nMessage: " + e.message);
            }
            else{
                throw new Error("Unable to fill " + locatorName + "\nMessage: " + e.message);
            }
        }
    }

    // Type the value in the element.
    async TypeValue(locator: string, inputValue: string, locatorName: string){
        try{
            await this.page.type(locator, inputValue);
        }
        catch(e){
            if(e instanceof errors.TimeoutError){
                throw new Error("Unable to type " + locatorName + "\nMessage: " + e.message);
            }
            else{
                throw new Error("Unable to type " + locatorName + "\nMessage: " + e.message);
            }
        }
    }

    // Enter the value in the element field.
    async EnterValue(locator: string, inputValue: string, locatorName: string){
        try{
            await this.Click(locator, locatorName);
            await this.FillUpValue(locator, "", locatorName);
            await this.TypeValue(locator, inputValue, locatorName);
        }
        catch(e){
            if(e instanceof errors.TimeoutError){
                throw new Error("Unable to enter " + inputValue + " in " + locatorName + "\nMessage: " + e.message);
            }
            else{
                throw new Error("Unable to enter " + inputValue + " in " + locatorName + "\nMessage: " + e.message);
            }
        }
    }

    // Enter the value in the element.
    async enterValue(locator: string, inputValue: string, locatorName: string){
        try{
            await this.Click(locator, locatorName);
            await this.FillUpValue(locator, "", locatorName);
            await this.TypeValue(locator, inputValue, locatorName);
        }
        catch(e){
            if(e instanceof errors.TimeoutError){
                throw new Error("Unable to enter " + inputValue + " in " + locatorName + "\nMessage: " + e.message);
            }
            else{
                throw new Error("Unable to enter " + inputValue + " in " + locatorName + "\nMessage: " + e.message);
            }
        }
    }

    // Enter the value in the element.
    async enterViaPressKey(locator: string, inputValue: string, locatorName: string){
        try{
            var count = 1;
            var textValue = await this.GetElementTextviaHTML(locator, locatorName);
            do{
                await this.Click(locator, locatorName);
                await this.FillUpValue(locator, "", locatorName);
                textValue = await this.GetElementTextviaHTML(locator, locatorName);
                count++;
            }while(textValue!="" && count<=3);

            for(var i=0; i<inputValue.length; i++){
                if(inputValue[i] == " "){
                    var keyValue = " ";
                }
                else{
                    var keyValue = "Key" + inputValue[i];
                }
                await this.page.keyboard.press(keyValue);
                await this.Sleep(1000);
            }
        }
        catch(e){
            if(e instanceof errors.TimeoutError){
                throw new Error("Unable to enter " + inputValue + " in " + locatorName + "\nMessage: " + e.message);
            }
            else{
                throw new Error("Unable to enter " + inputValue + " in " + locatorName + "\nMessage: " + e.message);
            }
        }
    }

    // Enter the value in the element.
    async ClearValues(locator: string, locatorName: string){
        try{
            await this.FillUpValue(locator, "", locatorName);
        }
        catch(e){
            if(e instanceof errors.TimeoutError){
                throw new Error("Unable to clear values for " + locatorName + "\nMessage: " + e.message);
            }
            else{
                throw new Error("Unable to clear values for " + locatorName + "\nMessage: " + e.message);
            }
        }
    }

    // Select from dropdown.
    async SelectFromDropdown(locator: string, selectType: string, selectValue: string, locatorName: string){
        try{
            if(selectType.toLowerCase()=="text"){
                await this.page.selectOption(locator, {label: selectValue});
            }
            else if(selectType.toLowerCase()=="value"){
                await this.page.selectOption(locator, {value: selectValue});
            }
            else{
                await this.page.selectOption(locator, {index: parseInt(selectValue)});
            }
            await this.Sleep(1000);
        }
        catch(e){
            if(e instanceof errors.TimeoutError){
                throw new Error("Unable to select " + selectValue + " from " + locatorName + "\nMessage: " + e.message);
            }
            else{
                throw new Error("Unable to enter " + selectValue + " from " + locatorName + "\nMessage: " + e.message);
            }
        }
    }

    // Get element value via HTML element
    async GetElementTextviaHTML(locator: string, locatorName: string){
        try{
          var textValue = await this.page.$eval<string, HTMLSelectElement>(locator, ele => ele.value); 
          console.log(locatorName + " value: " + textValue);
        }
        catch(e){
          if(e instanceof errors.TimeoutError){
            throw new Error ("Unable to find " + locatorName + ".\nMessage: " + e);
          }
          else{
            throw new Error ("Unable to find " + locatorName + ".\nMessage: " + e);
          }
        }
  
        return textValue.toString().trim();
    }

    // Get label value.
    async GetElementText(locator: string, locatorName: string){
        var textValue:string ="";
        try{
            var currentValue = await this.page.innerText(locator, {timeout: 90000});

            if(currentValue!=null){
                textValue = currentValue.toString().trim();
            }
            console.log(locatorName + " value: " + textValue);
        }
        catch(e){
            if(e instanceof errors.TimeoutError){
            throw new Error ("Unable to find " + locatorName + ".\nMessage: " + e);
            }
            else{
            throw new Error ("Unable to find " + locatorName + ".\nMessage: " + e);
            }
        }
        return textValue.toString().trim();
    }

    // Get label value.
    async GetElementTexts(locator: string, locatorName: string){
        var textValue = "";
        var textSet: string[] = [];
        try{
            var elements = await this.page.$$(locator);
            if(elements!=null){
                for(var i = 0; i<elements.length; i++){
                    var currentValue = elements[i];
                    if(currentValue!=null){
                        textValue = await currentValue.innerText();
                        console.log(locatorName + " value: " + textValue.toString().trim());
                        textSet.push(textValue.toString().trim());
                    }
                }
            }
            else{
                throw new Error ("Unable to find " + locatorName);
            }
        }
        catch(e){
            if(e instanceof errors.TimeoutError){
                
            }
            else{
                throw new Error ("Unable to find " + locatorName + ".\nMessage: " + e);
            }
        }
        return textSet;
    }

    // Get label value from live element
    async GetLiveElementText(element: ElementHandle, locatorName: string){
        var textValue = "";
        try{
            if(element!=null){
                textValue = (await element.innerText()).toString().trim();
                console.log(locatorName + " value: " + textValue);
            }
            else{
                throw new Error (locatorName + " value is null.");
            }
        }
        catch(e){
            if(e instanceof errors.TimeoutError){
                throw new Error ("Unable to find " + locatorName + ".\nMessage: " + e);
            }
            else{
                throw new Error ("Unable to find " + locatorName + ".\nMessage: " + e);
            }
        }
        return textValue;
    }

    // This will get the element attribute value.
    async GetElementValueByAttribute(element: ElementHandle, attributeType: string, elementName: string){
        var attribute: any;
        try{
            if(element!=null){
                attribute = await element.getAttribute(attributeType);
                console.log("Element Attribute: " + attribute.toString().trim());
            }
            else{
                throw new Error (elementName + " value is null.");
            }
        }
        catch(e){
          if(e instanceof errors.TimeoutError){
            throw new Error ("Unable to find the attribute of " + elementName + ".\nMessage: " + e);
          }
          else{
            throw new Error ("Unable to find the attribute of " + elementName + ".\nMessage: " + e);
          }
        }
        return attribute.toString().trim();
    }

    // This will check the element attribute based on the input.
    async CheckElementValueByAttribute(element: ElementHandle, attributeType: string, attributeValue: string, elementName: string){
      var attribute: any;
      let isExist:boolean = true;
      try{
        if(element!=null){
            attribute = await element.getAttribute(attributeType);
            console.log("Element attribute: " + attribute.toString().trim());
            if(!attribute.toString().trim().includes(attributeValue)){
                isExist = false;
            }
        }
        else{
            isExist = false;
        }
      }
      catch(e){
        if(e instanceof errors.TimeoutError){
          isExist = false;
        }
        else{
          isExist = false;
        }
      }

      console.log(elementName + " attribute status: " + isExist);
      return isExist;
    }

    // This will check the element attribute based on the input.
    async CheckElementAttributeExist(element: ElementHandle, attributeType: string, elementName: string){
        var attribute: any;
        let isExist:boolean = true;
        try{
          if(element!=null){
            var attribute: any;
            if(element!=null){
                attribute = await element.getAttribute(attributeType);
                if(attribute==null){
                    isExist = false;
                }
            }
            else{
                isExist = false;
            }
          }
          else{
              isExist = false;
          }
        }
        catch(e){
          if(e instanceof errors.TimeoutError){
            isExist = false;
          }
          else{
            isExist = false;
          }
        }
        return isExist;
    }

    // This will hover on element.
    async ElementHover(locator: string, locatorName: string){
        try{
            var element = await this.page.$(locator);
            if(element!=null){
                await element.scrollIntoViewIfNeeded();
                await element.hover({force: true});
            }
            console.log(locatorName + " was hovered ");
        }
        catch(e){
            if(e instanceof errors.TimeoutError){
                throw new Error("Unable to hover " + locatorName + "\nMessage: " + e.message);
            }
            else{
                throw new Error("Unable to hover " + locatorName + "\nMessage: " + e.message);
            }
        }
    }

    // This will convert number of days to date.
    async ConvertToDate(bookingDays: number = 0){
        try{
            var bookingDate = new Date();
            bookingDate.setDate(bookingDate.getDate() + bookingDays);
            return bookingDate;
        }
        catch(e){
            if(e instanceof errors.TimeoutError){
                throw new Error("Unable to convert days to date.\nMessage: " + e.message);
            }
            else{
                throw new Error("Unable to convert days to date.\nMessage: " + e.message);
            }
        }
    }

    // Format booking date to month and year.
    async FormatDate(bookingDate: string, formatType: string){
        try{
            var formattedDate = "";
            switch(formatType.toLowerCase().trim()){
                case "month year":
                    var setDate = new Date(bookingDate);
                    formattedDate = setDate.toLocaleDateString('en-us', { year:"numeric", month:"long"}).toString();
                    break;
                case "full date":
                    var setDate = new Date(bookingDate);
                    formattedDate = setDate.toLocaleDateString('en-us', { year:"numeric", month:"long", day: "numeric"}).toString();
                    break;
                case "ddmmyy":
                    var setDate = new Date(bookingDate);
                    var month = setDate.toLocaleDateString('en-us', { month:"short"}).toString();
                    var year = setDate.getFullYear().toString().substring(2, 4);
                    var day = setDate.toLocaleDateString('en-us', { day: "numeric"}).toString();
                    if(parseInt(day) < 10){
                        day = "0" + day;
                    }
                    var formattedDate = day + " " + month + " " + year;
                    break;
                case "dd/mm/yyyy":
                    var setDate = new Date(bookingDate);
                    var month = setDate.toLocaleDateString('en-us', { month:"numeric"}).toString();
                    if(parseInt(month)<10){month = "0" + month;}
                    var year = setDate.getFullYear().toString();
                    var day = setDate.toLocaleDateString('en-us', { day: "numeric"}).toString();
                    if(parseInt(day)< 10){day = "0" + day;}
                    var formattedDate = day + "/" + month + "/" + year;
                    break;
            }
    
            return formattedDate;
        }
        catch(e){
            if(e instanceof errors.TimeoutError){
                throw new Error("Unable to format " + bookingDate + "\nMessage: " + e.message);
            }
            else{
                throw new Error("Unable to format " + bookingDate + "\nMessage: " + e.message);
            }
        }
    }

    // This generate random email
    async GenerateRandomEmail(initialName: string, domainType: string, stringType: string, stringSize: number){
        var randomString = await this.GenerateRandomString(stringType, stringSize);
        return initialName + randomString + domainType;
    }
  
    // This generate random string or alphanumeric string.
    async GenerateRandomString(stringType: string, stringSize: number){
        try{
            var result = "";
            var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
            var numbers = "1234567890";
            var numbersLength = numbers.length;
            var charactersLength = characters.length;
            if(stringType.toLocaleLowerCase().trim() == "string"){
                for(var i = 0; i < stringSize; i++){
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
                }
            }
            else if(stringType.toLocaleLowerCase().trim() == "number"){
                for(var i = 0; i < stringSize; i++){
                result += numbers.charAt(Math.floor(Math.random() * numbersLength));
                }
            }
            else{
                var stringLength = (stringSize - Math.floor(stringSize/2)) + 1;
                var numberLength = Math.floor(stringSize/2) - 1;
                for(var a = 0; a < stringLength; a++){
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
                }
        
                for(var b = 0; b < numberLength; b++){
                result += numbers.charAt(Math.floor(Math.random() * numbersLength));
                }
            }
        
            return result;
        }
        catch(e){
            if(e instanceof errors.TimeoutError){
                throw new Error("Unable to generate random string.\nMessage: " + e.message);
            }
            else{
                throw new Error("Unable to generate random string.\nMessage: " + e.message);
            }
        }
      
    }

    // Get element value via HTML element
    async GetCSSAttribute(locator: string, attribute: string, locatorName: string){
        await this.Sleep(2000);
        var element = this.page.locator(locator);
        switch(attribute.toLowerCase().trim()){
            case "color":
                const value = await element.evaluate((ele) => {
                    return window.getComputedStyle(ele).getPropertyValue("color")
                });
                console.log(value);
                return value.toString().trim();
        }
    }

    // This will check if field is required
    async CheckIfRequiredField(locator: string, locatorName:string){
        try{    
            await this.page.locator(locator+'[required]');
        }catch(e){
            //await this.ScreenShot("Failed", false, e.stack);
            if(e instanceof errors.TimeoutError){
                throw new Error(e.stack);
            }
            else{
                throw new Error(e.stack);
            }
        }
    }

    // Return if checkbox is checked.
    async VerifyCheckBoxState(locator: string, locatorName: string){
        var isChecked = false;
        try{
            if(await this.page.locator(locator).isChecked()){
                isChecked = true;
            }
        }
        catch(e){
            if(e instanceof errors.TimeoutError){
                isChecked = false;
            }
            else{
                isChecked = false;
            }
        }
        return isChecked;
    }

    // Set booking dates input for create reservation API.
    async SetBookingDatesForCreateReservationAPI(bookingDays: string = "0"){
        try{
            var bookingDate = new Date();
            bookingDate.setDate(bookingDate.getDate() + parseInt(bookingDays));
            bookingDate.setHours(16);
            bookingDate.setMinutes(0);
            bookingDate.setSeconds(0);
            bookingDate.setMilliseconds(0);
            return bookingDate.toISOString().replace(".000Z", "Z").trim();
        }
        catch(e){
            //await this.ScreenShot("Failed", false, e.stack);
            if(e instanceof errors.TimeoutError){
                throw new Error(e.stack);
            }
            else{
                throw new Error(e.stack);
            }
        }
    }

    // Get the date difference from dashboard.
    async GetDateDifference(dateInput: string){
        try{
            // Set the date today.
            var dateToday = new Date();
            dateToday.setDate(dateToday.getDate() + 0);
            dateToday.setHours(0);
            dateToday.setMinutes(0);
            dateToday.setSeconds(0);
            dateToday.setMilliseconds(0);

            // Format date from dashboard.
            var dateDetails = dateInput.split('/');
            var day = dateDetails[0];
            var month = dateDetails[1];
            var year = dateDetails[2];
            var finalDate = month + "/" + day + "/" + year;
            var currentDate = new Date(finalDate);

            // Get date difference.
            var dateDiffTime = Math.abs(currentDate.getTime() - dateToday.getTime());
            var dateDifference = Math.ceil(dateDiffTime / (1000 * 60 * 60 * 24)); 

            return dateDifference;
        }
        catch(e){
            //await this.ScreenShot("Failed", false, e.stack);
            if(e instanceof errors.TimeoutError){
                throw new Error(e.stack);
            }
            else{
                throw new Error(e.stack);
            }
        }
    }

    // This will format the date based on the displayed checkin/checkout date.
    async FormatDateToManageBookingDate(dateInput: string){
        try{
            if(dateInput.includes("/")){
                var datePart = dateInput.split('/');
                var dateMonth = datePart[1];
                var dateDay = datePart[0];
                var dateYear = datePart[2];
                var newDate = new Date(dateMonth +"/"+ dateDay +"/"+ dateYear);
            }
            else if(dateInput.includes("-")){
                var datePart = dateInput.split('-');
                var dateMonth = datePart[1];
                var dateDay = datePart[2];
                var dateYear = datePart[0];
                var newDate = new Date(dateMonth +"-"+ dateDay +"-"+ dateYear);
            }
            else{
                var newDate = new Date();
                newDate.setDate(newDate.getDate() + parseInt(dateInput));
            }
            var initialDate = newDate.toLocaleDateString('en-us', { day:"numeric", month:"short"}).toString();
            var convertedDay = initialDate.split(" ")[1].trim();
            if(convertedDay.length > 1){
                var finalDate = convertedDay + " " + initialDate.split(" ")[0].trim();
            }
            else{
                var finalDate = "0" + convertedDay + " " + initialDate.split(" ")[0].trim();
            }
            return finalDate;
        }
        catch(e){
            //await this.ScreenShot("Failed", false, e.stack);
            if(e instanceof errors.TimeoutError){
                throw new Error(e.stack);
            }
            else{
                throw new Error(e.stack);
            }
        }
    }

    // This will get the total night per the reservation date.
    async GetTotalNights(reservationDates: string){
        try{
            var initCheckIn = reservationDates.split('-')[0].trim();
            var initCheckOut = reservationDates.split('-')[1].trim();
    
            var checkInMonth = initCheckIn.split(" ")[1].trim();
            var checkInDay = initCheckIn.split(" ")[0].trim();
            var checkOutMonth = initCheckOut.split(" ")[1].trim();
            var checkOutDay = initCheckOut.split(" ")[0].trim();
            var currentYear = new Date().getFullYear();
            var checkInDate = Date.parse(checkInMonth + " " + checkInDay + ", " + currentYear);
            var checkOutDate = Date.parse(checkOutMonth + " " + checkOutDay + ", " + currentYear);
            var a = new Date(checkInDate);
            var b = new Date(checkOutDate);
    
            // Discard the time and time-zone information.
            const _MS_PER_DAY = 1000 * 60 * 60 * 24;
            const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
            const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    
            return Math.floor((utc2 - utc1) / _MS_PER_DAY).toString();
        }
        catch(e){
            //await this.ScreenShot("Failed", false, e.stack);
            if(e instanceof errors.TimeoutError){
                throw new Error(e.stack);
            }
            else{
                throw new Error(e.stack);
            }
        }
    }

    // This will format the date based on the displayed checkin/checkout date.
    async FormatDateToManagePaymentDate(dateInput: string){
        try{
            var formatDate = new Date(dateInput);
            return formatDate.toLocaleString("en-GB", { month:"2-digit", year:"2-digit", day:"2-digit"}).split(", ")[0];
        }
        catch(e){
            //await this.ScreenShot("Failed", false, e.stack);
            if(e instanceof errors.TimeoutError){
                throw new Error(e.stack);
            }
            else{
                throw new Error(e.stack);
            }
        }
    }

    
}