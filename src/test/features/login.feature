Feature: OrangeHRM User Authentication

  Background:
    Given User navigates to the application login page

  Scenario: Login should be success with default credentials
    And User enter the username
    And User enter the password
    When User click on the login button
    Then Login should be success

  @invalid-login
  Scenario: Login should fail with invalid credentials
    And User enter the username as "AdminN"
    And User enter the password as "admin123"
    When User click on the login button
    Then Login should fail with error message "Invalid credentials"
    When User clear all input fields
    And User enter the username as "Admin"
    And User enter the password as "InvalidPwd"
    Then Login should fail with error message "Invalid credentials"