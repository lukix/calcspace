describe('Home Page', function() {
  it('should add new expression', () => {
    cy.visit('/');

    cy.contains('Add new line').click();
    cy.contains('Empty expression');
  });

  it('should edit expression', () => {
    cy.visit('/');

    cy.contains('Add new line').click();

    const expressionText = 'E = m*v^2 / 2';

    cy.contains('Empty expression').click();
    cy.focused()
      .type(expressionText)
      .blur();
    cy.contains(expressionText);
  });
});
