/// <reference types="Cypress" />
import * as data from "../fixtures/testData.json";

class Commons {

    static updateMyInfo() {
        cy.xpath("//span[normalize-space()='My Info']").click();
        cy.xpath("//input[@placeholder='First Name']").type(data.Firstname);
        cy.xpath("//input[@placeholder='Middle Name']").type(data.Middlename);
        cy.xpath("//input[@placeholder='Last Name']").type(data.Lastname);
        cy.xpath("//div[@class='orangehrm-horizontal-padding orangehrm-vertical-padding']//button[@type='submit'][normalize-space()='Save']").click();
    }

    static differentDateFormats(dateFormat = 'date2') {
        const currentDate = new Date();
        if (dateFormat === 'date1') {
          const day = currentDate.getDate().toString().padStart(2, '0');
          const month = currentDate.toLocaleString('default', { month: 'short' });
          const year = currentDate.getFullYear();
          return `${day}-${month}-${year}`;
        } else {
          const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          const dayAbbreviation = daysOfWeek[currentDate.getDay()];
          const dayOfMonth = currentDate.getDate();
          return `${dayAbbreviation}${dayOfMonth}`;
        }
      }


};
export default Commons;
