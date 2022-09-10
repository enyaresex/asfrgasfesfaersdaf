export {};

// const signUpData: SignUpUser = {
//   email: { selector: 'text-input-email', value: 'gokhan@gamerarena.com' },
//   fullName: { selector: 'text-input-full-name', value: 'Gökhan Sarı' },
//   password1: { selector: 'text-input-password', value: 'gokhan123' },
//   password2: { selector: 'text-input-password2', value: 'gokhan123' },
//   userName: { selector: 'text-input-username', value: 'gokhan' },
// };

describe('Test landing page ', () => {
  beforeEach(() => {
    cy.server();
    cy.route('POST', '/users/sign_up').as('signUpEndpoint');

    cy.visit('/');
    // cy.injectAxe();
  });

  // context('Check accessibility', () => {
  //   it('Has no detectable a11y violations on load', () => {
  //     cy.checkA11y();
  //   });
  // });

  // context('Sign up form test', () => {
  //   it('Displays errors on sign up', () => {
  //     // already signed up username and email
  //     const incorrectData: SignUpUser = {
  //       ...signUpData,
  //       email: { ...signUpData.email, value: 'gokhan1@gamerarena.com' },
  //       userName: { ...signUpData.userName, value: 'gokhan1' },
  //     };
  //
  //     cy.signUp(incorrectData);
  //
  //     cy.wait('@signUpEndpoint');
  //
  //     // we should have visible errors now
  //     cy.get('fieldset [class*="hasError"]')
  //       .should('be.visible');
  //
  //     cy.getCookie(Cypress.env('GAMERARENA_ACCESS_TOKEN_COOKIE_NAME')).should('not.exist');
  //
  //     // and still be on the same URL
  //     cy.location().should((loc) => {
  //       expect(loc.pathname).to.eq('/');
  //     });
  //   });
  //
  //   // sign up test is commented since we need to generate unique user for each test or remove the user before the test
  //   it('redirects to app.gamerarena.com on success', () => {
  //     cy.signUp(signUpData);
  //
  //     // we should be redirected to app.gamerarena.com
  //     cy.url({ timeout: 3000 }).should('include', 'https://app.gamerarena.com/').then(() => {
  //       cy.getCookie('gamerarena-development-access-token').should('exist');
  //     });
  //   });
  // });

  context('FAQ is working', () => {
    it('faq is clickable', () => {
      // faq div exists
      cy.get('[data-cy="faq"]').should('exist');

      // initially all the list items are closed
      cy.get('[data-cy="faq"]').find('button[class*="active"]').should('not.exist');

      // faq list items are clickable
      cy.get('[data-cy="faq"]').find('button').each((el) => cy.wrap(el).click());

      // after clicking each button, the last button should be open
      cy.get('[data-cy="faq"]').find('button').last().parent()
        .should((b) => expect(b[0].className).to.match(/active/));
    });
  });

  context('Partner links are working', () => {
    it('partners are accessible', () => {
      cy.get('[data-cy="partners"] a').each((el) => {
        cy.wrap(el).should('have.attr', 'target', '_blank');
        cy.wrap(el).should('have.attr', 'href');
      });
    });
  });
});
