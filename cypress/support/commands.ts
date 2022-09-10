// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
export {};

Cypress.Commands.add('signUp', (data: SignUpUser) => {
  (Object.keys(data) as SignUpUserKey[]).forEach((key) => {
    const { value, selector } = data[key];

    cy.get(`input#${selector}`).click();
    cy.focused().type(value).should('have.value', value);
  });

  cy.get('label[for="checkbox-terms-agreed"]').click()
    .parent()
    .find('input')
    .should('be.checked');

  cy.get('label[for="checkbox-terms-agreed2"]').click()
    .parent()
    .find('input')
    .should('be.checked');

  cy.get('button[type="submit"]').click()
    .then(() => {
      cy.get('fieldset').should('be.disabled');
    });
});
