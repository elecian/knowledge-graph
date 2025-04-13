// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Ensure that uncaught exceptions don't fail tests in development
// but do fail in CI to catch real issues
Cypress.on('uncaught:exception', (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  if (Cypress.env('CI')) {
    return true; // In CI, we want to fail on uncaught exceptions
  }
  return false; // In dev, we want to continue even if there are exceptions
})

// Add a small delay between commands to ensure animations complete
// and elements are fully rendered before interacting with them
Cypress.Commands.overwrite('click', (originalFn, ...args) => {
  const [element, options] = args;
  return originalFn(element, { waitForAnimations: true, ...options });
});
