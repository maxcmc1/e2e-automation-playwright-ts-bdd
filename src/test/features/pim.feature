Feature: Employee Management via PIM

  Background:
    Given User navigates to the application login page
    And User enter the username
    And User enter the password
    When User click on the login button
    Then Login should be success

  Scenario: Admin can add a new employee successfully
    Given User navigates to PIM Add Employee page
    When User enters new employee details
    Then Employee personal details page should load
    And User logs out
    When User logs in with newly created employee credentials
    Then Login should be success

  Scenario: Admin can successfully remove employee from the system 
    Given User navigates to PIM Add Employee page
    When User enters new employee details
    Then Employee personal details page should load
    And User searches for new employee
    And User removes the employee from the system
    And User logs out
    When User logs in with newly created employee credentials
    Then Login should fail with error message "Invalid credentials" for deleted employee
    