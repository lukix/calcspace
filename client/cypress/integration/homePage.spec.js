describe('Home Page', function() {
  it('should visits home page', function() {
    cy.visit('/');

    cy.contains('Show').click();

    cy.contains('Hide');
  });
});
