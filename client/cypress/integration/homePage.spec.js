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

  it('should merge current expression with the previous one when pressed backspace on the beginning of the expression', () => {
    cy.visit('/');

    cy.get('.math-expression input').click();
    cy.focused()
      .type('123')
      .type('{enter}');

    cy.focused()
      .type('456')
      .type('{leftarrow}{leftarrow}{backspace}{backspace}');

    cy.contains('12356');
  });

  it('move focus to the previous expression when pressed arrow up', () => {
    cy.visit('/');

    cy.get('.math-expression input').click();
    cy.focused()
      .type('123')
      .type('{enter}');

    cy.focused()
      .type('456')
      .type('{uparrow}');

    cy.focused().should('have.value', '123');
  });

  it('move focus to the next expression when pressed arrow down', () => {
    cy.visit('/');

    cy.get('.math-expression input').click();
    cy.focused()
      .type('123')
      .type('{enter}');

    cy.focused()
      .type('456')
      .type('{uparrow}');

    cy.focused().type('{downarrow}');

    cy.focused().should('have.value', '456');
  });
});
