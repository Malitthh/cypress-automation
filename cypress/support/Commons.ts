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
};
export default Commons;