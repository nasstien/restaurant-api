## Introduction

The Restaurant Management API provides endpoints for managing various aspects of a restaurant data, including users, menu items, tables, reservations, orders, payments, and reviews. It is built using **TypeScript**, **Node.js**, **Express.js**, and **MongoDB**.

## Getting Started

1. Clone the repository:

```sh
git clone https://github.com/nasstien/restaurant-api.git
```

2. Open the project directory and install dependencies:

```sh
npm install
```

3. Configure environment variables (use [config.env.example](config.env.example)).
4. Run the server.

Production mode:

```sh
npm run start:prod
```

Development mode:

```sh
npm run start:dev
```

## Endpoints

| Endpoint                          | Description                                                                                                                   |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `/api/menu`                       | Endpoint for managing menu information.                                                                                       |
| `/api/menu/:itemId/reviews`       | Endpoint for managing menu item review information.                                                                           |
| `/api/tables`                     | Endpoint for managing table information.                                                                                      |
| `/api/reservations`               | Endpoint for managing reservation information. Only users who have the "employee" or "admin" role are permitted to access it. |
| `/api/orders`                     | Endpoint for managing order information. Only users who have the "employee" or "admin" role are permitted to access it.       |
| `/api/users`                      | Endpoint for managing user information.                                                                                       |
| `/api/users/:userId/reservations` | Endpoint for managing user reservation information.                                                                           |
| `/api/users/:userId/orders`       | Endpoint for managing user order information.                                                                                 |
| `/api/users/:userId/payments`     | Endpoint for managing user payment information.                                                                               |
| `/api/users/update-role`          | Endpoint for updating user roles and permissions. Only users who have the "admin" role are permitted to access it.            |
| `/api/users/update-password`      | Endpoint for updating user passwords.                                                                                         |
| `/api/users/delete-account`       | Endpoint for handling deactivation of user accounts.                                                                          |

#### Statistics Endpoints

| Endpoint                               | Description                                                                               |
| -------------------------------------- | ----------------------------------------------------------------------------------------- |
| `/api/stats/users/role`                | Endpoint for getting the count of users grouped by their roles.                           |
| `/api/stats/users/activity`            | Endpoint for retrieving the count of active and inactive users.                           |
| `/api/stats/income-per-month/:month`   | Endpoint for getting total income for a specific month or all months.                     |
| `/api/stats/top-selling-items`         | Endpoint for retrieving the top 5 best-selling menu items.                                |
| `/api/stats/most-reserved-tables`      | Endpoint for getting the top 5 most reserved tables.                                      |
| `/api/stats/review-percentage/:itemId` | Endpoint for calculating the percentage of positive and negative reviews for a menu item. |

## Authorization

The API uses **JSON Web Tokens (JWT)** for authentication. After successful login, a token is generated and stored in a cookie.

#### Endpoints

| Endpoint                          | Description                                                |
| --------------------------------- | ---------------------------------------------------------- |
| `/api/auth/signup`                | Endpoint for creating a new account.                       |
| `/api/auth/login`                 | Endpoint for logging into user accounts.                   |
| `/api/auth/logout`                | Endpoint for logging out the currently authenticated user. |
| `/api/auth/forgot-password`       | Endpoint for initiating the password reset process.        |
| `/api/auth/reset-password/:token` | Endpoint for resetting the password using a reset token.   |

## Security

The API has basic security measures to ensure the protection of data and resources. These measures include limiting JSON payloads, rate limiting, as well as defense mechanisms against various types of attacks, such as NoSQL query injection, cross-site scripting (XSS) and HTTP parameter pollution.

## Responses

Successful response:

```json
{
    "status": "success",
    "code": 200,
    "results": 2,
    "message": "Success!",
    "data": {}
}
```

Error response:

```json
{
    "status": "error",
    "error": {
        "code": 400,
        "message": "Something went wrong."
    }
}
```

#### Status Codes

| Status Code | Description             |
| ----------- | ----------------------- |
| `200`       | `OK`                    |
| `201`       | `Created`               |
| `204`       | `No Content`            |
| `400`       | `Bad Request`           |
| `401`       | `Unauthorized`          |
| `403`       | `Forbidden`             |
| `404`       | `Not Found`             |
| `429`       | `Too Many Requests`     |
| `500`       | `Internal Server Error` |
