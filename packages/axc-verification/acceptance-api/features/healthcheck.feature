Feature: API healthcheck

  Scenario: GET /health returns the agentCourses health contract
    When the client requests the health endpoint
    Then the response status is 200
    And the health payload reports status "ok"
    And the health payload reports service "agentCourses-api"
    And the health payload reports projectCode "axc"
    And the health payload reports environment "test"
    And the health payload reports an ISO-8601 timestamp
