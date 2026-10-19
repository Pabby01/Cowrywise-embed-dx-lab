# Validation checklist before describing this as a live integration

- [ ] Confirm current sandbox access and credential process with Cowrywise.
- [ ] Confirm current API base URL and authentication contract from official docs.
- [ ] Confirm official Node SDK package name, supported Node versions, and current release.
- [ ] Obtain authorized sandbox credentials; do not use credentials belonging to another person or company.
- [ ] Verify one happy-path API request against the live sandbox.
- [ ] Verify at least one documented error case.
- [ ] Confirm request/response schemas and required identifiers.
- [ ] Confirm webhook signature verification and retry semantics before publishing webhook examples.
- [ ] Record date, SDK version, environment, and test steps.
- [ ] Clearly label anything not tested.

Until these checks are complete, this repository remains a mock-mode proof of work, not a verified Cowrywise integration.
