/// <reference types="cypress" />

describe("Verify the Petstore APIs", () => {
  var data: any;
  let GetURL: any;
  let apiToken: any;
  let requestId: any;

  before(function () {
    cy.fixture("Files/PetstoreData/petstoreHeaders").then((date) => {
      data = date;
      apiToken = data.Test.code;
    });
  });

  //validate the response of post API with Valid Data
  it.only("Validate the response of petstore APIs With Valid Data", () => {
    let filename = "cypress/fixtures/Files/PetstoreData/petstoreOutput.json"; //output file

    //define a json obj
    var emptyObj = {
      testdate: [],
    };

    //Add a new JSON obj to the file
    cy.writeFile(filename, JSON.stringify(emptyObj));

    //csv file as input data
    cy.parseCsv("cypress/fixtures/Files/PetstoreData/petstoreSample.csv").then((jsonData) => {

      function unicodeToChar(text) {
        return text.replace(/\\u[\dA-F]{4}/gi, function (match) {
          return String.fromCharCode(parseInt(match.replace(/\\u/g, ""), 16));
        });
      }

      for (let i = 1; i < 100; i++) {
        let sourceid = String(jsonData[0].data[i][1]);
        let columnA = unicodeToChar(String(jsonData[0].data[i][2]));
        let columnB = unicodeToChar(String(jsonData[0].data[i][3]));
        let columnC = String(jsonData[0].data[i][4]);
        let columnD = String(jsonData[0].data[i][5]);
        let columnE = String(jsonData[0].data[i][6]);
        let columnF = String(jsonData[0].data[i][7]);
        let columnG = String(jsonData[0].data[i][8]);
        let columnH = String(jsonData[0].data[i][9]);
        let columnI = unicodeToChar(String(jsonData[0].data[i][10]));
        let columnJ = unicodeToChar(String(jsonData[0].data[i][11]));

        cy.request({
          method: "POST",
          url: Cypress.env("petstorePOST"),
          failOnStatusCode: false,
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            Token: apiToken,
          },
          timeout: 0,
          body: {
            SOURCEID: sourceid,
            EXTERNAL_BOOK_ID: "TEST",
            column_J: columnJ,
            column_B: columnB,
            column_I: columnI,
            column_A: columnA,
            column_E: columnE,
            column_F: columnF,
            column_C: columnC,
            column_G: columnG,
            column_D: columnD,
            column_H: columnH,
            TEST_LANG: "EN",
          },
        }).then((resFromPost) => {
          expect(resFromPost.status).to.eq(202);
          requestId = resFromPost.body["request_id"];
          cy.log(requestId);
          cy.wait(20000);
          GetURL = Cypress.env("petstoreGET") + requestId;
          cy.request({
            method: "GET",
            url: GetURL,
            failOnStatusCode: false,
            headers: {
              Accept: "*/*",
              Token: apiToken,
            },
            body: {},
          }).then(getCompletedStatus);

          function getCompletedStatus() {
            cy.request({
              method: "GET",
              url: GetURL,
              failOnStatusCode: false,
              headers: {
                Token: apiToken,
              },
            }).then((resFromGet) => {

              if (resFromGet.status == 200 && resFromGet.body.Status == "completed") {
                expect(resFromGet.status).to.eq(200);
                cy.log(resFromGet.body.Status)
                expect(resFromGet.body).to.not.to.be.null;
                let testDate = String(resFromGet.body.Result.TEST_DATE);
                let sourceID = String(resFromGet.body.Result.SOURCEID);
                let testVersion = String(resFromGet.body.Result.Test_VERSION);
                cy.log(testDate);
                if (
                  testDate == ""

                ) {
                  let testdateObj = {
                    "article-uuid": requestId,
                    testDate: "Empty",
                    "column_J": columnJ,
                    column_B: columnB,
                    column_I: columnI,
                    column_A: columnA,
                    column_E: columnE,
                    column_F: columnF,
                    column_C: columnC,
                    column_G: columnG,
                    column_D: columnD,
                    column_H: columnH,
                    VERSION: testVersion,
                  };

                  cy.readFile(filename).then((jsonData) => {
                    console.log(jsonData);
                    if (!jsonData.testNew_Data_Test) {
                      jsonData.testNew_Data_Test = [];
                    }

                    jsonData.testNew_Data_Test.push(testdateObj);
                    console.log(jsonData);
                    cy.writeFile(filename, JSON.stringify(jsonData));
                  });
                  return;
                } else {
                  let testdateObj = {
                    "article-uuid": requestId,
                    testDate: "Empty",
                    "column_J": columnJ,
                    column_B: columnB,
                    column_I: columnI,
                    column_A: columnA,
                    column_E: columnE,
                    column_F: columnF,
                    column_C: columnC,
                    column_G: columnG,
                    column_D: columnD,
                    column_H: columnH,
                    VERSION: testVersion,
                  };
                  cy.readFile(filename).then((jsonData) => {
                    if (!jsonData.testNew_Data_Test) {
                      jsonData.testNew_Data_Test = [];
                    }

                    jsonData.testNew_Data_Test.push(testdateObj);
                    console.log(jsonData);
                    cy.writeFile(filename, JSON.stringify(jsonData));
                  });
                }
                return;
              } else getCompletedStatus();
            });
          }
        });
      }
    });
  });

  //validate the response of post API with empty source-id parameter
  it("Validate the response of petstore API with empty source-id parameter", () => {

    cy.parseCsv("cypress/fixtures/Files/PetstoreData/petstoreSample.csv").then((jsonData) => {

      function unicodeToChar(text) {
        return text.replace(/\\u[\dA-F]{4}/gi, function (match) {
          return String.fromCharCode(parseInt(match.replace(/\\u/g, ""), 16));
        });
      }

      for (let i = 1; i < 10; i++) {
        let columnA = unicodeToChar(String(jsonData[0].data[i][2]));
        let columnB = unicodeToChar(String(jsonData[0].data[i][3]));
        let columnC = String(jsonData[0].data[i][4]);
        let columnD = String(jsonData[0].data[i][5]);
        let columnE = String(jsonData[0].data[i][6]);
        let columnF = String(jsonData[0].data[i][7]);
        let columnG = String(jsonData[0].data[i][8]);
        let columnH = String(jsonData[0].data[i][9]);
        let columnI = unicodeToChar(String(jsonData[0].data[i][10]));
        let columnJ = unicodeToChar(String(jsonData[0].data[i][11]));

        cy.request({
          method: "POST",
          url: Cypress.env("petstorePOST"),
          failOnStatusCode: false,
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            Token: apiToken,
          },
          timeout: 0,
          body: {
            SOURCEID: "",
            EXTERNAL_BOOK_ID: "TEST",
            column_J: columnJ,
            column_B: columnB,
            column_I: columnI,
            column_A: columnA,
            column_E: columnE,
            column_F: columnF,
            column_C: columnC,
            column_G: columnG,
            column_D: columnD,
            column_H: columnH,
            TEST_LANG: "EN",
          },
        }).then((resFromPost) => {
          cy.wait(20000);
          expect(resFromPost.status).to.eq(202);

        });
      }
    });
  });

  //validate the response of post API with empty column_C id parameter
  it("Validate the response of petstore API with with column_C id parameter", () => {

    cy.parseCsv("cypress/fixtures/Files/PetstoreData/petstoreSample.csv").then((jsonData) => {

      function unicodeToChar(text) {
        return text.replace(/\\u[\dA-F]{4}/gi, function (match) {
          return String.fromCharCode(parseInt(match.replace(/\\u/g, ""), 16));
        });
      }

      for (let i = 1; i < 10; i++) {
        let sourceid = String(jsonData[0].data[i][1]);
        let columnA = unicodeToChar(String(jsonData[0].data[i][2]));
        let columnB = unicodeToChar(String(jsonData[0].data[i][3]));
        let columnC = String(jsonData[0].data[i][4]);
        let columnD = String(jsonData[0].data[i][5]);
        let columnE = String(jsonData[0].data[i][6]);
        let columnF = String(jsonData[0].data[i][7]);
        let columnG = String(jsonData[0].data[i][8]);
        let columnH = String(jsonData[0].data[i][9]);
        let columnI = unicodeToChar(String(jsonData[0].data[i][10]));
        let columnJ = unicodeToChar(String(jsonData[0].data[i][11]));

        cy.request({
          method: "POST",
          url: Cypress.env("petstorePOST"),
          failOnStatusCode: false,
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            Token: apiToken,
          },
          timeout: 0,
          body: {
            SOURCEID: sourceid,
            EXTERNAL_BOOK_ID: "TEST",
            column_J: columnJ,
            column_B: columnB,
            column_I: columnI,
            column_A: columnA,
            column_E: columnE,
            column_F: columnF,
            column_C: "",
            column_D: columnD,
            column_H: columnH,
            TEST_LANG: "EN",
          },
        }).then((resFromPost) => {
          cy.wait(20000);
          expect(resFromPost.status).to.eq(202);

        });
      }
    });
  });

  //validate the response of post API with Incorrect code parameter
  it.skip("Validate the response of petstore API with incorrect code parameter", () => {

    cy.parseCsv("cypress/fixtures/Files/PetstoreData/petstoreSample.csv").then((jsonData) => {

      function unicodeToChar(text) {
        return text.replace(/\\u[\dA-F]{4}/gi, function (match) {
          return String.fromCharCode(parseInt(match.replace(/\\u/g, ""), 16));
        });
      }

      for (let i = 1; i < 10; i++) {
        let sourceid = String(jsonData[0].data[i][1]);
        let columnA = unicodeToChar(String(jsonData[0].data[i][2]));
        let columnB = unicodeToChar(String(jsonData[0].data[i][3]));
        let columnC = String(jsonData[0].data[i][4]);
        let columnD = String(jsonData[0].data[i][5]);
        let columnE = String(jsonData[0].data[i][6]);
        let columnF = String(jsonData[0].data[i][7]);
        let columnG = String(jsonData[0].data[i][8]);
        let columnH = String(jsonData[0].data[i][9]);
        let columnI = unicodeToChar(String(jsonData[0].data[i][10]));
        let columnJ = unicodeToChar(String(jsonData[0].data[i][11]));

        cy.request({
          method: "POST",
          url: Cypress.env("petstorePOST"),
          failOnStatusCode: false,
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            Token: data.Test.incorrectcode,
          },
          timeout: 0,
          body: {
            SOURCEID: sourceid,
            EXTERNAL_BOOK_ID: "TEST",
            column_J: columnJ,
            column_B: columnB,
            column_I: columnI,
            column_A: columnA,
            column_E: columnE,
            column_F: columnF,
            column_C: "",
            column_D: columnD,
            column_H: columnH,
            TEST_LANG: "EN",
          },
        }).then((resFromPost) => {
          expect(resFromPost.status).to.eq(403);
          expect(resFromPost.body).to.not.to.be.null;
        });
      }
    });
  });

  //validate the response of post API with empty code parameter
  it.skip("Validate the response of petstore API with empty code parameter", () => {

    cy.parseCsv("cypress/fixtures/Files/PetstoreData/petstoreSample.csv").then((jsonData) => {

      function unicodeToChar(text) {
        return text.replace(/\\u[\dA-F]{4}/gi, function (match) {
          return String.fromCharCode(parseInt(match.replace(/\\u/g, ""), 16));
        });
      }

      for (let i = 1; i < 10; i++) {
        let sourceid = String(jsonData[0].data[i][1]);
        let columnA = unicodeToChar(String(jsonData[0].data[i][2]));
        let columnB = unicodeToChar(String(jsonData[0].data[i][3]));
        let columnC = String(jsonData[0].data[i][4]);
        let columnD = String(jsonData[0].data[i][5]);
        let columnE = String(jsonData[0].data[i][6]);
        let columnF = String(jsonData[0].data[i][7]);
        let columnG = String(jsonData[0].data[i][8]);
        let columnH = String(jsonData[0].data[i][9]);
        let columnI = unicodeToChar(String(jsonData[0].data[i][10]));
        let columnJ = unicodeToChar(String(jsonData[0].data[i][11]));

        cy.request({
          method: "POST",
          //url: Cypress.env("petstorePOST") + "code=" + "" + "&source-id=" + sourceid + "&test-book-id=" + data.Prod.testbookid + "&column-j=" + columnJ,
          url: Cypress.env("petstorePOST"),
          failOnStatusCode: false,
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
            Token: "",
          },
          timeout: 0,
          body: {
            SOURCEID: sourceid,
            EXTERNAL_BOOK_ID: "TEST",
            column_J: columnJ,
            column_B: columnB,
            column_I: columnI,
            column_A: columnA,
            column_E: columnE,
            column_F: columnF,
            column_C: "",
            column_D: columnD,
            column_H: columnH,
            TEST_LANG: "EN",
          },
        }).then((resFromPost) => {
          expect(resFromPost.status).to.eq(403);
          expect(resFromPost.body).to.not.to.be.null;
        });
      }
    });
  });


});