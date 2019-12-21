describe('Home Page', () => {
  it('should calculate result based on previously defined variable', () => {
    cy.visit('/');

    cy.get('.math-expression input').click();
    cy.focused()
      .type('x = 5')
      .type('{enter}');

    cy.focused().type('x + 3');

    cy.contains('= 8');
  });

  it('should move text on the right of the cursor to the new expression below', () => {
    cy.visit('/');

    cy.get('.math-expression input').click();
    cy.focused()
      .type('x = 1 + 2')
      .type('{leftarrow}{leftarrow}{leftarrow}{leftarrow}')
      .type('{enter}');

    cy.focused().type('x');

    cy.contains(' = 3');

    cy.get('.math-expression').should('have.length', 3);
  });
});
