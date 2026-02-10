describe('Green Pizza Application', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the page title', () => {
    cy.contains('Green Pizza').should('be.visible');
  });

  it('should check health endpoint', () => {
    cy.request('/api/health')
      .its('status')
      .should('eq', 200);
  });

  it('should load pizza menu', () => {
    cy.request('/api/menu')
      .its('body')
      .should('have.property', 'pizzas')
      .and('be.an', 'array')
      .and('have.length.greaterThan', 0);
  });

  it('should display pizza cards', () => {
    cy.get('.pizza-card').should('have.length.greaterThan', 0);
  });

  it('should open order modal when clicking order button', () => {
    cy.get('.order-btn').first().click();
    cy.get('.modal').should('have.css', 'display', 'flex');
  });

  it('should validate order form', () => {
    cy.get('.order-btn').first().click();
    cy.get('#quantity').clear().type('2');
    cy.get('#customerName').type('Test User');
    cy.contains('Order Now').click();
  });
});
