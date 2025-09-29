import Footer from '@/components/Footer.vue';

describe('Warmup', () => {
  it('mounts a component to warm up Cypress and Vite', () => {
    cy.mount(Footer);
    cy.wait(1000);
  });
});
