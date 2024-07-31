/// <reference types="cypress" />

describe("Verify the Petstore API Functionalities", () => {
    // Validate the POST, GET response with valid data
    let petData: any;
    let baseURL: any;
    let apiKey: any;
  
    before(function () {
      cy.fixture("Files/PetstoreData/petstoreHeaders").then((testdata) => {
        petData = testdata;
      });
    });
  
    it.only("TC-01: Validate the create pet POST API", () => {
      let allPetData = [];
  
      // Read input data from JSON file
      cy.readFile('cypress/fixtures/Files/PetstoreData/petstore.json').then((data) => {
        data.forEach((postData, index) => {
          cy.wait(30000 * index).then(() => {
            cy.request({
              method: "POST",
              url: `${baseURL}/pet`,
              headers: {
                Accept: "*/*",
                "Content-Type": "application/json",
                apiKey: petData.PetstoreAPIKey,
              },
              body: postData,
            }).then((resFromPost) => {
              expect(resFromPost.status).to.eq(200);
              const petId = resFromPost.body.id;
  
              // Call function to check pet status and continue
              return checkPetStatusAndContinue(petId);
            }).then((petDetails) => {
              allPetData.push(petDetails);
  
              if (allPetData.length === data.length) {
                cy.writeFile('cypress/fixtures/Files/PetstoreData/petstoreOutput.json', allPetData);
              }
            });
          });
        });
      });
  
      // Function to check pet status and continue
      const checkPetStatusAndContinue = (petId) => {
        const getURL = `${baseURL}/pet/${petId}`;
        return cy.wait(5000).then(() => {
          return cy.request({
            method: "GET",
            url: getURL,
            headers: {
              Accept: "*/*",
              "Content-Type": "application/json",
              apiKey: petData.PetstoreAPIKey,
            },
            failOnStatusCode: false,
          }).then((resFromGet) => {
            if (resFromGet.status === 200) {
              return {
                petId: petId,
                details: resFromGet.body
              };
            } else {
              throw new Error(`Pet with ID ${petId} could not be found.`);
            }
          });
        });
      };
    });
  
    it("TC-02: Validate the create pet POST API with incorrect URL", () => {
      baseURL = petData.InvalidPetstoreURL;
      apiKey = petData.PetstoreAPIKey;
  
      cy.request({
        method: "POST",
        url: `${baseURL}/invalid`,
        failOnStatusCode: false,
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          apiKey: apiKey,
        },
        body: {
          id: 12345,
          name: "Max",
          category: { id: 1, name: "Dog" },
          photoUrls: ["https://example.com/dog.jpg"],
          tags: [{ id: 1, name: "friendly" }],
          status: "available"
        },
      }).then((resFromPost) => {
        expect(resFromPost.status).to.eq(404);
        expect(resFromPost.body.message).to.contains("Not Found");
      });
    });
  
    it("TC-03: Validate the create pet POST API with empty body", () => {
      baseURL = petData.PetstoreBaseURL;
      apiKey = petData.PetstoreAPIKey;
  
      cy.request({
        method: "POST",
        url: `${baseURL}/pet`,
        failOnStatusCode: false,
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          apiKey: apiKey,
        },
        body: {},
      }).then((resFromPost) => {
        expect(resFromPost.status).to.eq(400);
        expect(resFromPost.body.message).to.contains("Invalid input");
      });
    });
  
    it("TC-04: Validate the response of POST API with empty API key", () => {
      baseURL = petData.PetstoreBaseURL;
  
      cy.request({
        method: "POST",
        url: `${baseURL}/pet`,
        failOnStatusCode: false,
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          apiKey: " ",
        },
        body: {
          id: 54321,
          name: "Bella",
          category: { id: 2, name: "Dog" },
          photoUrls: ["https://example.com/dog2.jpg"],
          tags: [{ id: 2, name: "playful" }],
          status: "available"
        },
      }).then((resFromPost) => {
        expect(resFromPost.status).to.eq(403);
        expect(resFromPost.body.message).to.contains("Not authenticated");
      });
    });
  
    it("TC-05: Validate the create pet POST API with incorrect authorization", () => {
      baseURL = petData.PetstoreBaseURL;
      apiKey = petData.InvalidAPIKey;
  
      cy.request({
        method: "POST",
        url: `${baseURL}/pet`,
        failOnStatusCode: false,
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          apiKey: apiKey,
        },
        body: {
          id: 67890,
          name: "Charlie",
          category: { id: 3, name: "Dog" },
          photoUrls: ["https://example.com/dog3.jpg"],
          tags: [{ id: 3, name: "loyal" }],
          status: "available"
        },
      }).then((resFromPost) => {
        expect(resFromPost.status).to.eq(403);
        expect(resFromPost.body.message).to.contains("Invalid API key");
      });
    });
  });
  