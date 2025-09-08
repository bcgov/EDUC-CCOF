import Login from "../../src/components/Login.vue";

describe("<Login />", () => {
    it("mounts", () => {
        cy.mount(Login);
    })
})