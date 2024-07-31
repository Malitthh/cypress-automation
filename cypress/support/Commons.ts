/// <reference types="Cypress" />

class Commons {

  static addtoCart() {
    cy.xpath("//button[@id='add-to-cart-sauce-labs-backpack']").click();
    cy.xpath("//button[@id='add-to-cart-sauce-labs-bolt-t-shirt']").click();
    cy.xpath("//button[@id='add-to-cart-sauce-labs-fleece-jacket']").click();
    cy.xpath("//div[@id='shopping_cart_container']/a[@class='shopping_cart_link']").click();
  }

  static generateRandomData() {
    const randomFirstName = `Soap${Math.floor(Math.random() * 100)}`;
    const randomLastName = `Mactavish${Math.floor(Math.random() * 100)}`;
    const randomZip = Math.floor(Math.random() * 10000);
    return {
      namefirst: randomFirstName,
      namelast: randomLastName,
      zip: randomZip.toString()
    };
  }

  static updateUserPermissions(permission) {
    cy.xpath("//div[contains(text(),'" + permission + "')]/following-sibling::div//i").then((icon) => {
      if (icon.attr('class') == 'icon green icon-checked' || icon.attr('class') == 'icon green icon-checked grey') {
        cy.xpath("//div[contains(text(),'" + permission + "')]/following-sibling::div//i")
          .should('have.class', 'icon green icon-checked').click()
        cy.xpath("//div[contains(text(),'" + permission + "')]/following-sibling::div//i")
          .should('have.class', 'icon green icon-unchecked')
      } else {
        cy.xpath("//div[contains(text(),'" + permission + "')]/following-sibling::div//i")
          .should('have.class', 'icon green icon-unchecked')
      }
    })
    utils.clickButton("Apply Changes");
    notifications.displayMessage('Success', 'Permissions updated successfully');
  }
  
};
export default Commons;