describe('Home Page', function() {
  it('should add new expression when clicked add button', () => {
    cy.visit('/');

    cy.get('.MathExpression').should('have.length', 1);
    cy.contains('Add new line').click();
    cy.get('.MathExpression').should('have.length', 2);
  });

  it('should edit expression', () => {
    cy.visit('/');

    const expressionText = 'E = m*v^2 / 2';

    cy.contains('Empty expression').click();
    cy.focused()
      .type(expressionText)
      .blur();
    cy.contains(expressionText);
  });
});
