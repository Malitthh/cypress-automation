/// <reference types="cypress" />

declare namespace Cypress {
    interface Chainable<Subject = any> {
        statusTextGenerator(
            date,
            statusCode,
            sinDie,
            pendingCommiteeId
        ): Chainable<null>;
        parseCsv(inputFile: string): any
    }
}

declare namespace Cypress {
    interface Chainable<Subject = any> {
        Login(
            username,
            password
        )
        readCSV(
            filePath
        )
        fetchCellValue(filePath, row, column)
        replaceCellValue(filePath, sheetName, cellRef, newValue)
        addUniqueUId()
    }
}