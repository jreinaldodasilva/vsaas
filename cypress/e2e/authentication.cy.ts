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

  it('navigates to forgot-password page', () => {
    cy.contains('Esqueceu a senha?').click();
    cy.url().should('include', '/forgot-password');
    cy.get('input[type="email"]').should('exist');
  });

  it('navigates to register page', () => {
    cy.contains('Criar conta').click();
    cy.url().should('include', '/register');
    cy.get('#name').should('exist');
    cy.get('#companyName').should('exist');
  });

  it('shows forgot-password success message on submit', () => {
    cy.visit('/forgot-password');
    cy.get('input[type="email"]').type('user@example.com');
    cy.get('button[type="submit"]').click();
    cy.contains('link').should('be.visible');
  });
});

describe('Protected Routes', () => {
  it('redirects unauthenticated user to login', () => {
    cy.visit('/admin/dashboard');
    cy.url().should('include', '/login');
  });

  it('shows unauthorized page for invalid route', () => {
    cy.visit('/unauthorized');
    cy.contains('não autorizado', { matchCase: false }).should('be.visible');
  });
});
