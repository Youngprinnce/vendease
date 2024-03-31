# Vendease Backend Implementation

This repository contains the backend implementation for the Vendease platform. The implementation follows the technical requirements provided in the task description.


## Installation
- On your desktop terminal run the command ```git clone https://github.com/Youngprinnce/vendease.git```
- In the project folder, Change ```.env.example ``` file in the project root directory to ```.env```
- Replace the DATABASE_URL with your preferred postgres url.
- Run command ```npm install``` to download project dependencies
- Run command ```npm run start:dev``` to run application
- Run command ```npm run test``` to run unit test

## Swagger Documentation

The documentation for the API endpoints is available on Swagger. You can access it using the following link:

[Swagger Documentation](https://vendease-8c336a838f33.herokuapp.com/api-docs#/)

### Implemented Endpoints

- **Episode Resource**
  - `GET /episodes`: Episode list endpoint sorted by “releaseDate” from oldest to newest with each episode listed along with the count of comments
  - `POST /episodes`: Create new episodes.
  - `POST /episodes/:id/comments`: Add a comment to an Episode Object.
  - `GET /episodes/get-character-episodes/:characterId`: Retrieve a List of Episodes a Character is featured in.
  - `POST /episodes/:id/assign-characters`: Link multiple characters to an episode

- **Comment Resource**
  - `GET /comments`: Retrieve all comments in reverse chronological order with the public IP address of the commenter and DateTime they were stored.

- **Characters**
  - `GET /characters`: Retrieve all characters
  - `POST /characters`: Create a character
  - `POST /characters/:id/assign-episodes`: Link multiple episodes to a character

- **Lcation**
  - `GET /locations`: Endpoint to retrieve all locations
  - `POST /locations`: Endpoint to create a location


## License

Nest is [MIT licensed](LICENSE).
