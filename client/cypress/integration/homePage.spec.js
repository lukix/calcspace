describe('Home Page', () => {
  it('should calculate result based on previously defined variables', () => {
    cy.visit('/');

    cy.contains('Empty expression').click();
    cy.focused()
      .type('x = 5')
      .blur();

    cy.contains('Empty expression').click();
    cy.focused()
      .type('x + 3')
      .blur();

    cy.contains('= 8');
  });

  it('should move text on the right of the cursor to the new expression below', () => {
    cy.visit('/');

    cy.contains('Empty expression').click();
    cy.focused()
      .type('x = 1 + 2')
      .blur();

    cy.contains('Empty expression').click();
    cy.focused()
      .type('y = 3')
      .blur();

    cy.get('.math-expression')
      .eq(0)
      .click();

    cy.focused().type(
      '{end}{leftarrow}{leftarrow}{leftarrow}{leftarrow}{enter}'
    );
    cy.focused().contains('+ 2');
    cy.focused().blur();

    cy.get('.math-expression').should('have.length', 4);
  });
});
