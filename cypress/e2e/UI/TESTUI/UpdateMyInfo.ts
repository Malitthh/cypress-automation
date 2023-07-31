/// <reference types="cypress" />
import Common from "cypress/support/Commons";
describe("Login and Update My Info", () => {
    let Data;
    beforeEach(function () {
        cy.fixture("testData").then((user) => {
            Data = user;
            let username = Data.Username;
            let password = Data.Password;
            cy.LoginHRM(username, password);
        });
    });

    it("Update My Info", () => {
        Common.updateMyInfo();
    });
});
