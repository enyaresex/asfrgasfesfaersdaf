export {};

// const quickDuelInputs = {
//   entryFee: { selector: '[data-cy="quickDuel"] #quick-duel-select-entry-fee', value: '100' },
//   game: { selector: '[data-cy="quickDuel"] #quick-duel-select-game', value: 'MOBA', val: '1' },
//   gameMode: { selector: '[data-cy="quickDuel"] #quick-duel-select-game-mode', value: '1v1 First Kill (PC)', val: '1' },
//   platform: { selector: '[data-cy="quickDuel"] #quick-duel-select-platform', value: 'PC', val: '1' },
//   requiredAccountField: { selector: '[data-cy="quickDuel"] #quickDuel-required-account-field', value: 'account name' },
//   submitButton: { selector: '[data-cy="quickDuel"] button[type="submit"]' },
// };
//
// const { entryFee, game, gameMode, platform, requiredAccountField, submitButton } = quickDuelInputs;
// const localStorageName = 'gamer-arena-quick-duel-selection';
//
// function fillEntryFeeInput() {
//   return cy.get(entryFee.selector).select(entryFee.value);
// }
//
// function fillGameInput() {
//   return cy.get(game.selector).then((el) => {
//     cy.wrap(el).focus().select(game.value).then((gameInput) => {
//       expect(localStorage.getItem(localStorageName)).to
//         .eq(`{"game":"${gameInput.val()}","gameMode":"","platform":""}`);
//     });
//     cy.get(platform.selector).should('not.be.disabled').should('have.value', null);
//     cy.get(gameMode.selector).should('be.disabled').should('have.value', null);
//     cy.get(requiredAccountField.selector).should('have.length', 0);
//     cy.get(entryFee.selector).should('be.disabled').should('have.value', '50');
//   });
// }
//
// function fillGameModeInput() {
//   return cy.get(gameMode.selector).then((el) => {
//     cy.wrap(el).focus().select(gameMode.value).then((gameModeInput) => {
//       expect(localStorage.getItem(localStorageName)).to
//         .eq(`{"game":"${game.val}","gameMode":"${gameModeInput.val()}","platform":"${platform.val}"}`);
//     });
//     cy.get(requiredAccountField.selector).then((input) => {
//       const val = input.val();
//
//       if ((val || '').toString().length > 0) {
//         cy.get(requiredAccountField.selector).should('have.length', 1).should('have.value', requiredAccountField.value);
//         cy.get(entryFee.selector).should('not.be.disabled').should('have.value', '50');
//       } else {
//         cy.get(requiredAccountField.selector).should('have.length', 1).should('not.be.disabled');
//         cy.get(entryFee.selector).should('be.disabled').should('have.value', '50');
//       }
//     });
//   });
// }
//
// function fillPlatformInput() {
//   return cy.get(platform.selector).then((el) => {
//     cy.wrap(el).focus().select(platform.value).then((platformInput) => {
//       expect(localStorage.getItem(localStorageName)).to
//         .eq(`{"game":"${game.val}","gameMode":"","platform":"${platformInput.val()}"}`);
//     });
//     cy.get(gameMode.selector).should('not.be.disabled').should('have.value', null);
//     cy.get(requiredAccountField.selector).should('have.length', 0);
//     cy.get(entryFee.selector).should('be.disabled')
//       .should('not.have.value', undefined)
//       .should('not.have.value', '');
//   });
// }
//
// function fillRequiredAccountFieldInput() {
//   return cy.get(requiredAccountField.selector).then((el) => {
//     const val = el.val();
//     if ((val || '').toString().length === 0) {
//       cy.wrap(el).focus().type(requiredAccountField.value);
//     }
//
//     cy.get(entryFee.selector).should('not.be.disabled')
//       .should('not.have.value', undefined)
//       .should('not.have.value', '');
//   });
// }
//
// describe('Test arena page ', () => {
//   /* TODO: Or you can create a new duel triggers pop up */
//   /* TODO: If requiredAccountName exists do not show the input area */
//   before(() => {
//     cy.clearLocalStorage(localStorageName);
//   });
//
//   beforeEach(() => {
//     cy.visit('/arena');
//   });
//
//   context('Quick Duel is working', () => {
//     beforeEach(() => {
//       cy.get(game.selector).invoke('val', null);
//       cy.get(platform.selector).invoke('val', null);
//       cy.get(gameMode.selector).invoke('val', null);
//       cy.get(entryFee.selector).invoke('val', 50);
//     });
//
//     it('Initially input areas should be disabled', () => {
//       cy.get(platform.selector).should('be.disabled');
//       cy.get(gameMode.selector).should('be.disabled');
//
//       cy.get(requiredAccountField.selector).should('have.length', 0);
//     });
//
//     it('Select boxes should be selectable.', () => {
//       cy.get(game.selector).focus().select(game.value);
//
//       cy.get(platform.selector).focus().select(platform.value);
//
//       cy.get(gameMode.selector).focus().select(gameMode.value);
//
//       cy.get(requiredAccountField.selector).should('exist').focus().type(requiredAccountField.value);
//
//       cy.get(entryFee.selector).should('have.value', '50').focus().select(entryFee.value);
//     });
//
//     it('Disabled states are working', () => {
//       /* Only Game Input Has Value */
//       fillGameInput();
//
//       /* Game, Platform Inputs Have Value */
//       fillPlatformInput();
//
//       /* Game, Platform, GameMode Inputs Have Value */
//       fillGameModeInput();
//
//       /* Game, Platform, GameMode, RequiredAccountField Inputs Have Value */
//       fillRequiredAccountFieldInput();
//
//       /* All Inputs Have Value */
//       fillEntryFeeInput();
//     });
//
//     it('Switching form filling order is working', () => {
//       fillGameInput();
//       fillPlatformInput();
//
//       fillGameInput();
//       fillPlatformInput();
//       fillGameModeInput();
//
//       fillGameInput();
//       fillPlatformInput();
//       fillGameModeInput();
//
//       fillPlatformInput();
//       fillGameModeInput();
//
//       fillGameInput();
//       fillPlatformInput();
//       fillGameModeInput();
//       fillRequiredAccountFieldInput();
//
//       fillPlatformInput();
//       fillGameModeInput();
//       fillRequiredAccountFieldInput();
//
//       fillGameModeInput();
//       fillRequiredAccountFieldInput();
//       fillEntryFeeInput();
//
//       fillRequiredAccountFieldInput();
//       fillEntryFeeInput();
//
//       fillGameInput();
//       fillPlatformInput();
//       fillGameModeInput();
//       fillRequiredAccountFieldInput();
//       fillEntryFeeInput();
//     });
//
//     it('Quick Duel submit button is working', () => {
//       /* TODO: Check disabled state on fieldset */
//       fillGameInput();
//       fillPlatformInput();
//       fillGameModeInput();
//       fillRequiredAccountFieldInput();
//       fillEntryFeeInput();
//
//       cy.get(submitButton.selector).click();
//     });
//   });
// });
