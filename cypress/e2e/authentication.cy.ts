// cypress/e2e/authentication.cy.ts
describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('shows login form', () => {
    cy.get('form.login-form').should('exist');
    cy.get('input[type="email"]').should('exist');
    cy.get('input[type="password"]').should('exist');
  });

  it('shows error on invalid credentials', () => {
    cy.get('input[type="email"]').type('invalid@example.com');
    cy.get('input[type="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();
    cy.get('.form-error').should('be.visible');
  });

  it('redirects to dashboard on valid login', () => {
    cy.get('input[type="email"]').type('admin@vsaas.test');
    cy.get('input[type="password"]').type('TestPassword123!@#');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/admin/dashboard');
  });

  // TODO: Add domain-specific auth tests here
});
