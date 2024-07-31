/// <reference types="cypress" />
import commons from "../../../support/Commons";

const dayjs = require('dayjs');
var customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

describe("Marvel Database Details", () => {
    let Data;
    beforeEach(function () {
        cy.fixture("UserData").then((user) => {
            Data = user;
            let username = Data.username;
            let password = Data.password;
            cy.LoginMarvel(username, password);
        });
    });

    it('TC01: Validate Character Details are stored in the database', () => {
        const characterId = 'spiderman';
        const characterLink = `${Cypress.env('url')}${characterId}`;
        commons.visitPage('Marvel Characters');
        commons.clickRefresh();
        commons.clickSortIcon('characterName', 'td td-tm fa-sort pull-right');
        cy.xpath('//div[@class="loading" and not(@hidden)]').should('not.exist');
        cy.xpath("//b[text()='Character Id:']//parent::span").eq(2).then((text) => {
            let sourceId = text.text().toString().split('Character Id:')[1].trim();
            commons.clickOnCheckBox(2);
            cy.xpath('//button[text()="Assign to me"]').should('be.visible').click();
            commons.confirmPopupVerification('Select Assignment Type');
            commons.selectAssignmentType(3);
            commons.clickButton('Confirm');
            cy.intercept('POST', '/api/marvel/character/update').as('characterUpdate');
            commons.clickButton('Ok');
            cy.wait('@characterUpdate').then((res) => {
                expect(res.response.statusCode).to.eq(200);
            });
            commons.SuccessMessage('Success', 'Character details have been updated');
            cy.xpath('//div[@formarrayname="CharacterDetails"]').should('be.visible').eq(2).within(() => {
                cy.get('.item-content').should('contain', 'peterparker@dailybugle.com');
            });
            cy.task('establishMSSQLConnection', 'marvelsql01.cloud.test');
            cy.task<{ recordset?: any[] }>('executeMSSQLQuery', {
                query: `SELECT TOP 1 [ch].NAME, ca.IS_DELETED
                FROM [marvel].[character].[TYPE] [ch]
                LEFT JOIN [marvel].[character].[ASSIGNEE] ca ON [ch].id=ca.ID
                WHERE ca.ID='${sourceId}'
                AND ca.ASSIGNEE='peterparker@dailybugle.com'
                ORDER BY ca.Id DESC`
            }).then((result) => {
                const resultSet = result.recordset[0];
                const assignmentType = resultSet.NAME;
                const deleted = resultSet.IS_DELETED;
                expect(deleted).to.eq(false);
                expect(assignmentType).to.contain('Marvel Hero');
            });
            cy.task('dropMSSQLConnection');
            cy.visit(characterLink);
            cy.xpath('//div[@class="statictext"]').should('contain', 'Character ID');
            cy.task('establishMSSQLConnection', 'marvelsql01.cloud.test');
            cy.task<{ recordset?: any[] }>('executeMSSQLQuery', {
                query: `SELECT TOP 1 * FROM [marvel_test].[character].[details]
                WHERE details_ID='${sourceId}'`
            }).then((result) => {
                const resultSet = result.recordset[0];
                expect(resultSet).to.exist;
                expect(resultSet.details_ID).to.eq(sourceId);
            });
            cy.task('dropMSSQLConnection');
        });
    });
});
