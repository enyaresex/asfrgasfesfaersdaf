/// <reference types="cypress" />

type Input = {
  selector: string
  value: string,
}

type SignUpUserKey = 'email' | 'fullName' | 'password1' | 'password2' | 'userName';

type SignUpUser = Record<SignUpUserKey, Input>;

declare namespace Cypress {
  // interface Chainable {
  //   checkA11y(): Chainable<EventEmitter>
  //   injectAxe(): Chainable<EventEmitter>
  //   signUp(data: SignUpUser): Chainable<Element>
  // }
}
