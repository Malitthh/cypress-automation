/// <reference types="cypress" />
import commons from "../../../support/Commons";

const dayjs = require('dayjs');
var customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

describe("Sample Details", () => {
    let Data;
    beforeEach(function () {
        cy.fixture("FileName").then((user) => {
            Data = user;
            let username = Data.username;
            let password = Data.password;
            cy.LoginRDM(username, password);
        });
    });

    it('TC46: Validate UI code is stored in the database', () => {
        const billId = 'test';
        const billLink = `${Cypress.env('url')}${billId}`;
        commons.visitPage('Test');
        commons.clickRefresh();
        commons.clickSortIcon('buttontext', 'td td-tm fa-sort pull-right');
        cy.xpath('//div[@class="loading" and not(@hidden)]').should('not.exist');
        cy.xpath("//b[text()='Document Id:']//parent::span").eq(2).then((text) => {
            let sourceId = text.text().toString().split('Document Id:')[1].trim();
            commons.clickOnCheckBox(2);
            cy.xpath('//button[text()="Test to me"]').should('be.visible').click();
            commons.confirmPopupVerification('Select Assignment Type');
            commons.selectAssignmentType(3);
            commons.clickButton('Confirm');
            cy.intercept('POST', '/api/test/test/textupdate').as('textupdate');
            commons.clickButton('Ok');
            cy.wait('@assignee').then((res) => {
                expect(res.response.statusCode).to.eq(200);
            });
            commons.SuccessMessage('Success', 'Text assignee has been updated');
            cy.xpath('//div[@formarrayname="Texts"]').should('be.visible').eq(2).within(() => {
                cy.get('.item-content').should('contain', 'test@google.pvt-Template');
            });
            cy.task('establishMSSQLConnection', 'testdb1sql01.cloud.local');
            cy.task<{ recordset?: any[] }>('executeMSSQLQuery', {
                query: `SELECT TOP 1 [at].NAME, ba.IS_DELETED
                FROM [test].[book].[TYPE] [at]
                LEFT JOIN [test].[book].[ASSIGNEE] ba ON [at].id=ba.ID
                WHERE ba.ID='${textId}'
                AND ba.ASSIGNEE='test@google.pvt'
                ORDER BY ba.Id DESC`
            }).then((result) => {
                const resultSet = result.recordset[0];
                const assignmentType = resultSet.NAME;
                const deleted = resultSet.IS_DELETED;
                expect(deleted).to.eq(false);
                expect(assignmentType).to.contain('TEST DEV');
            });
            cy.task('dropMSSQLConnection');
            cy.visit(billLink);
            cy.xpath('//div[@class="statictext"]').should('contain', 'Text ID');
            cy.task('establishMSSQLConnection', 'testdb1sql01.cloud.local');
            cy.task<{ recordset?: any[] }>('executeMSSQLQuery', {
                query: `SELECT TOP 1 * FROM [cube_rdi_test].[book].[dep]
                WHERE dep_ID='${textidId}'`
            }).then((result) => {
                const resultSet = result.recordset[0];
                expect(resultSet).to.exist;
                expect(resultSet.dep_ID).to.eq(textidId);
            });
            cy.task('dropMSSQLConnection');
        });
    });
});
