/// <reference types="cypress" />
import Common from "cypress/support/Commons";

describe("Login and Add Items to Cart", () => {
    let Data;

    beforeEach(function () {
        cy.fixture("swaglabsTestData").then((user) => {
            Data = user;
            let username = Data.Username;
            let password = Data.Password;
            cy.Login(username, password);
        });
    });

    it("Add Items to Cart", () => {
        const random = Common.generateRandomData();
        Common.addtoCart();
        cy.xpath("//button[@id='checkout']").click();
        cy.xpath("//input[@id='first-name']").click().type(random.namefirst);
        cy.xpath("//input[@id='last-name']").click().type(random.namelast);
        cy.xpath("//input[@id='postal-code']").click().type(random.zip);
        cy.xpath("//div[@class='checkout_buttons']/input[@id='continue']").click();

        // Assertions for Payment Information
        cy.contains('Payment Information').should('be.visible');
        cy.contains('SauceCard #31337').should('be.visible');

        // Assertions for Shipping Information
        cy.contains('Shipping Information').should('be.visible');
        cy.contains('Free Pony Express Delivery!').should('be.visible');

        // // Extract and assert dynamically for Price Total
        // cy.contains('Price Total').should('be.visible').then(() => {
        //     cy.xpath("//div[@class='summary_subtotal_label']").invoke('text').then(itemTotalText => {
        //         const itemTotal = parseFloat(itemTotalText.split('$')[1].trim());
        //         cy.xpath("//div[@class='summary_tax_label']").invoke('text').then(taxText => {
        //             const tax = parseFloat(taxText.split('$')[1].trim());
        //             cy.xpath("//div[@class='summary_info_label summary_total_label']").invoke('text').then(totalText => {
        //                 const total = parseFloat(totalText.split('$')[1].trim());
        //                 const expectedTotal = itemTotal + tax;
        //                 expect(total).to.equal(expectedTotal);
        //             });
        //         });
        //     });
        // });
        cy.xpath("//button[@id='finish']").click();
        cy.xpath("//h2[normalize-space()='Thank you for your order!']").should('be.visible');
    });


});
