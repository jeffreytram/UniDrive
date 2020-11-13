/// <reference types="Cypress" />
// import { config } from '../../../src/config';
/// <reference types="Cypress" />
// import { config } from '../../../src/config';

describe('Test 1', () => {
  it('testo', () => {
    cy.visit('/');

    // cy.pause();

    // cy.contains('type').click();

    // cy.url().should('include', '/commands/actions');
  });
});

describe('Login', () => {
  it('Login through Google', () => {
    const username = Cypress.env('googleSocialLoginUsername');
    const password = Cypress.env('googleSocialLoginPassword');
    const loginUrl = Cypress.env('loginUrl');
    const cookieName = Cypress.env('cookieName');
    const socialLoginOptions = {
      username,
      password,
      loginUrl,
      headless: false,
      isPopup: true,
      loginSelector: 'button[id="signin-btn"]',
      logs: false,
      popupDelay: 3000,
    };

    return cy.task('GoogleSocialLogin', socialLoginOptions).then(({ cookies }) => {
      cy.clearCookies();

      const cookie = cookies.filter((cookie) => cookie.name === cookieName).pop();
      if (cookie) {
        cy.setCookie(cookie.name, cookie.value, {
          domain: cookie.domain,
          expiry: cookie.expires,
          httpOnly: cookie.httpOnly,
          path: cookie.path,
          secure: cookie.secure,
        });

        Cypress.Cookies.defaults({
          preserve: cookieName,
        });
      }
    });
  });
});
