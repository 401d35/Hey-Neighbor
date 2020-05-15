# Hey Neighbor

## Authors

- Morgan Heinemann
- Wenhao Piao
- Alex Pena
- Alex Pedersen

## Project Overview

- `Hey Neighbor!` is a neighborhood focused tool loaning and communication service
- `Non-Users` are able to query tools available in their local area to get an idea if they would like to join the service
- `Users` are initially assigned a neighborhood geographically but can join other groups for discussions as well
- `Users` are able to create a record of tools they own and are willing to loan out to other users, as well as maintain a transaction history of who has what at any given time
- `Tools` have a multi-step check-out and check-in process to ensure approval from all parties and these steps are stored in a larger log file for easy reference
- `Tools` and `Users` can have reviews indicating their overall quality, punctuality, and function. This provides feedback to `Users` on both sides of the transaction as to the state of the tool or the character of the individual
- `Chat rooms` are designated geographically and are the means by which people can talk as well as initiate a formal request to borrow tools.

## Tools Used

- `Google` for Oauth
- `MongoDB` for data retention
- [`Trello`](https://trello.com/b/57y9roix/team-401d35) for task tracking

### Domain Model

![domain model UML](assets/Domain-model.jpeg)

### .env file setup
* Create your own .env file in root folder
* PORT=3000
* MONGODB_URL=mongodb://localhost/hey-neighbor
* OAUTH_CLIENT_ID=444667393820-6rpjjjaepv6lu63oecpe61e6698bd01s.apps.googleusercontent.com
* OAUTH_SECRET_ID=M_xA5KS1W5S4B09Zdr7YmrVb
* GOOGLE_APPLICATION_CREDENTIALS=../backend/Google Aouth/auth/client_secret_444667393820-6rpjjjaepv6lu63oecpe61e6698bd01s.apps.googleusercontent.com.json

- Create your own .env file in root folder
  - PORT=3000
  - MONGODB_URL=mongodb://localhost/hey-neighbor
  - SECRET=JWTSECRETKEY

### Generic Model

- This generic model supports basic mongoDB CRUD operations. This is for creating dynamic model later.
  - `create(record)`: create a record in the DB and return it
  - `get(_id)`: return a record by `_id` from the DB; if `_id` is not given, it will return all the records from the DB
  - `update(_id, record)`: update a record in the DB by _id and return updated record
  - `delete(_id)`: delete a record in the DB by _id and return deleted record

### Schemas
- In the schema directory there are 5 individual schema's that create the dynamic shape of the Mongo database. 
  - `item-schema`: Creates the form template for the {key : value} pairs for an item created by a user
  - `user-schema` : Creates the form template for the {key : value} pairs for an user created by basic or Google OAuth.
  - `review-schema` : Creates the form template for the {key : value} pairs for reviews created after a rental transaction.
  - `region-schema` : Creates the form template for location {key : value} pairs associated with a given user in the database.
  - `rental-schema` : Creates the form template for custody {key : value} pairs associated with a given item in the database.
### API Routes
- In the route directory there 4 seperate route files responsible for connecting the application and its endpoints.
  - `itemRoute.js` : Connects the components neccessary to perform CRUD operations for a given item in the database.
  - `rentalRoute.js` : Connects the components *required* to perform CRUD operations by tracking when an item is rented and returned.
  - `rewiewRoute.js` : Connects the components *required* to perform CRUD operations when a users leave reviews for each other after a rental transaction.
  - `userRoute.js` : Connects all the necessary components *required* to perform CRUD operations for a user via Basic or Google OAuth 2.0.

### Tests

- generic model: Run Command `__tests__/model.test.js --verbose --coverage`
