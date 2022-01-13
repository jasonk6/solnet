describe("Solnet Technical Assessment", () => {
  it("Login", () => {
    const username = Cypress.env("username");
    const password = Cypress.env("password");

    cy.visit("/");
    cy.get("#mat-input-0")
      .should("have.attr", "placeholder", "Email")
      .clear()
      .type(username);
    cy.get("#mat-input-1")
      .should("have.attr", "placeholder", "Password")
      .clear()
      .type(password, { log: false });
    cy.get(".mat-card-actions > .login-field")
      .should("have.prop", "type", "submit")
      .click();
  });

  it("Landing page validation", () => {
    cy.url().should("include", "/nav/home");
    cy.findByRole("navigation").within(() => {
      cy.contains("My day")
        .should("have.attr", "href", "/nav/home")
        .and("have.class", "selected");
      cy.contains("All Tasks")
        .should("have.attr", "href", "/nav/all-tasks")
        .and("not.have.class", "selected");
      cy.contains("Important Tasks")
        .should("have.attr", "href", "/nav/important-tasks")
        .and("not.have.class", "selected");
    });
  });

  it("Add and remove task", () => {
    // Add blank task
    cy.get("#addTask").click();
    cy.get("#mat-error-1").contains("Task title is required");

    // Adds task
    cy.get("#mat-input-2").clear().type("Eggs");
    cy.get("#mat-input-3").clear().type("Go buy eggs");
    cy.get("#addTask").click();

    //Removes task
    cy.get(".home-page > :nth-child(2)").within(() => {
      cy.contains("Test Task 1");
    });

    cy.get(".home-page > :nth-child(3)").within(() => {
      cy.contains("Eggs");
      cy.contains("close").click();
    });

    cy.get(".home-page > :nth-child(3)").should("not.exist");
  });

  it("Mark/unmark a task as done", () => {
    cy.get(".task-card").within(() => {
      cy.contains("Test Task 1");
      cy.get(".completed-task").should("not.exist");
      cy.get(
        "#mat-checkbox-2 > .mat-checkbox-layout > .mat-checkbox-inner-container"
      ).click();
      cy.get(".completed-task");
      cy.get(
        "#mat-checkbox-2 > .mat-checkbox-layout > .mat-checkbox-inner-container"
      ).click();
      cy.get(".completed-task").should("not.exist");
    });
  });

  it("Validate All Tasks page", () => {
    const checkbox = ".mat-checkbox-inner-container";

    cy.findByRole("navigation").contains("All Tasks").click();
    cy.findByRole("navigation")
      .contains("All Tasks")
      .and("have.class", "selected");
    cy.url().should("include", "/nav/all-tasks");
    cy.get(".home-card").within(() => {
      cy.contains("Test Task 1");
      cy.get(checkbox).click();
      cy.get(".completed-task");
      cy.get(checkbox).click();
    });
  });

  it("Validates Important Tasks page", () => {
    cy.findByRole("navigation").contains("My day").click();
    cy.get("#mat-input-2").clear().type("Important task");
    cy.get(".mat-datepicker-toggle-default-icon").click();
    cy.get(".mat-calendar-period-button").click();
    cy.findByRole("button", { name: /2023/i }).click();
    cy.findByRole("button", { name: /June 2023/i }).click();
    cy.findByRole("button", { name: /21/i }).click();
    cy.get(
      "#mat-checkbox-1 > .mat-checkbox-layout > .mat-checkbox-inner-container"
    ).click();
    cy.get("#addTask").click();

    cy.get("#mat-input-2").clear().type("Important task2");
    cy.get("#addTask").click();

    cy.findByRole("navigation").contains("Important Tasks").click();
    cy.findByRole("navigation")
      .contains("Important Tasks")
      .and("have.class", "selected");
    cy.url().should("include", "/nav/important-tasks");
    cy.get(".home-card").within(() => {
      cy.contains("Important task");
    });
  });
});
