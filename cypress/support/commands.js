// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom command to check if an element has a specific CSS property
Cypress.Commands.add('shouldHaveStyle', { prevSubject: true }, (subject, property, value) => {
  cy.wrap(subject)
    .should('have.css', property)
    .and((computedValue) => {
      expect(computedValue).to.include(value);
    });
});

// Custom command to press and hold on an element
Cypress.Commands.add('pressAndHold', { prevSubject: true }, (subject, duration = 1000) => {
  cy.wrap(subject)
    .trigger('mousedown', { button: 0 })
    .wait(duration);
  
  return cy.wrap(subject);
});

// Custom command to drag an element
Cypress.Commands.add('dragTo', { prevSubject: true }, (subject, x, y) => {
  cy.wrap(subject)
    .trigger('mousedown', { button: 0 })
    .trigger('mousemove', { clientX: x, clientY: y, force: true })
    .wait(200); // Small wait to ensure the drag is registered
  
  return cy.wrap(subject);
});

// Custom command to release a pressed element
Cypress.Commands.add('release', { prevSubject: true }, (subject) => {
  cy.wrap(subject)
    .trigger('mouseup', { force: true });
  
  return cy.wrap(subject);
});
