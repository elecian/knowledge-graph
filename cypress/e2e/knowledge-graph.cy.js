/// <reference types="cypress" />

describe('Knowledge Graph', () => {
  beforeEach(() => {
    // Visit the page before each test
    cy.visit('/');
    
    // Wait for the graph to initialize
    cy.get('svg').should('be.visible');
    cy.get('.node').should('have.length.greaterThan', 0);
  });

  it('should display the knowledge graph with nodes and links', () => {
    // Check that the graph elements are present
    cy.get('.node').should('have.length.greaterThan', 10);
    cy.get('.link').should('have.length.greaterThan', 10);
    cy.get('.node-label').should('have.length.greaterThan', 10);
    
    // Verify node styling
    cy.get('.node').first()
      .should('have.attr', 'fill', 'white')
      .should('have.attr', 'stroke', '#000')
      .should('have.attr', 'stroke-width', '2');
    
    // Verify link styling
    cy.get('.link').first()
      .should('have.attr', 'stroke', '#3498db')
      .should('have.attr', 'stroke-dasharray', '5, 3');
  });

  it('should show space effect when pressing and holding on a node', () => {
    // Press and hold on a node
    cy.get('.node').first().pressAndHold(500);
    
    // Check that the space aura appears
    cy.get('.space-aura').should('exist')
      .should('have.attr', 'class', 'space-aura');
    
    // Check that the node has the selected class
    cy.get('.node').first().should('have.class', 'selected');
    
    // Release the node and check that the space effect disappears
    cy.get('.node').first().release();
    cy.get('.space-aura').should('not.exist');
    cy.get('.node').first().should('not.have.class', 'selected');
  });

  it('should maintain space effect while dragging a node', () => {
    // Get the initial position
    cy.get('.node').first().then($node => {
      const initialRect = $node[0].getBoundingClientRect();
      const initialX = initialRect.x;
      const initialY = initialRect.y;
      
      // Press down on the node
      cy.get('.node').first().trigger('mousedown', { button: 0 });
      
      // Check that the space aura appears
      cy.get('.space-aura').should('exist');
      
      // Drag the node
      cy.get('.node').first().trigger('mousemove', { 
        clientX: initialX + 50, 
        clientY: initialY + 50,
        force: true
      });
      
      // Check that the space aura still exists during drag
      cy.get('.space-aura').should('exist');
      
      // Release the node
      cy.get('.node').first().trigger('mouseup', { force: true });
      
      // Check that the space effect disappears after release
      cy.get('.space-aura').should('not.exist');
    });
  });

  it('should add a new node when clicking the Add Random Node button', () => {
    // Count initial nodes
    cy.get('.node').then($initialNodes => {
      const initialCount = $initialNodes.length;
      
      // Click the add node button
      cy.get('#addNodeButton').click();
      
      // Check that a new node was added
      cy.get('.node').should('have.length', initialCount + 1);
    });
  });

  it('should reset the view when clicking the Reset View button', () => {
    // Press and hold on a node to show space effect
    cy.get('.node').first().pressAndHold(500);
    
    // Verify space effect is visible
    cy.get('.space-aura').should('exist');
    
    // Click the reset button
    cy.get('#resetButton').click();
    
    // Verify space effect is removed
    cy.get('.space-aura').should('not.exist');
    cy.get('.node').first().should('not.have.class', 'selected');
  });

  it('should highlight connections when clicking on a node', () => {
    // Click on a node
    cy.get('.node').first().click();
    
    // Check that some links are highlighted (red)
    cy.get('.link[stroke="#ff0000"]').should('exist');
    
    // Click on the background to reset
    cy.get('svg').click(5, 5);
  });
});
