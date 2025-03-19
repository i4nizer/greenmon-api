


### Error Handling
 - First of all, I want to say sorry to the dev reading this. I want to say sorry for being so verbose on error that it creates so much boilerplate when you just want to add a very small functionality.
 - Error handling is done low-level, hence every functions must return an error and data object.
 - When the data is boolean, you may not include it where existence of error means it was false, otherwise true.
 - I just hope your dream catches you like I catch these errors.

### Authentication
 - User authentication uses access and refresh tokens in authentication header while refresh token is posted for token rotation.
 - The tokens are what answers who is logged in because its payload is userId
 - For access tokens, just let them expire.
 - For refresh tokens, they need to be revoked and blacklisted when the user signs out.
 - MCU authentication uses api tokens in x-api-key header.
 - For api tokens, there isn't a way to secure IoT therefore, if there is malicious activity with the api key of mcus, just create a new mcu of same properties. This will create a new id that is used as payload of the mcu api key.

### Understanding Folder Structure
 - /ai                  - machine learning models
 - /configs             - constant variables
 - /controllers         - route handlers, basic model interaction, top level error handling
 - /logs                - system logs
 - /middlewares         - route middlewares, validations
 - /models              - database schemas
 - /services            - specific database model abstract interactions
 - /uploads             - api uploads, images only
 - /utils               - code-base wide reusable functions
 - /validations         - joi schemas for validation

### Database Model Relations and Purpose
 - user                 - user credentials and status
 - otp                  - user otp for acc verification and password change         (refs user)
 - token                - user token for authentication                             (refs user)
 - greenhouse           - basic details                                             (refs user)
 - mcu                  - pins, state, and api key                                  (refs greenhouse)
 - pin                  - number and state                                          (refs mcu)
 - sensor               - outputs, read interval, and state                         (refs mcu)
 - output               - type and pin                                              (refs sensor)
 - actuator             - inputs and state                                          (refs mcu)
 - input                - range and pin                                             (refs actuator)
 - threshold            - conditions and actions                                    (refs mcu)
 - condition            - type and precedence                                       (refs output)
 - action               - input value and duration                                  (refs input)
 - schedule             - action, hours, days                                       (refs input)