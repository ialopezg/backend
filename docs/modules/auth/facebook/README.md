<div align="center">
  <img height="85" src="https://ialopezg.com/packages/corejs/corejs-logo.png" alt="CoreJS Logo" />
</div>

<div align="center">
  :zap: <strong>Backend Server Layer</strong> :zap:
</div>
<br />

# Auth Module

## Facebook Authentication

### :book: Table of Content
- [Required Data](#required-data)
- [Common case](#common-case)
- [Alternative case](#alternative-case)
- [Exception case](#exception-case)
- [API](#api)

### Required Data
* Access Token

### Common case

> If user arrives at first time

1. Get user profile data (name, email, facebook ID) from Facebook API.
2. Verify if user exists into the database.
     * If no exists, creates a new account with data received from Facebook API and continue with next step.
3. Creates an access token with given user ID, with time expiration.
4. Return generated access token.

### Alternative case

> If user account exists with returned email profile from Facebook API

1. Update user account with data retrieved from Facebook API.
2. Creates an access token with given user ID, with time expiration.
3. Return generated access token.

### Exception case

> If user provide invalid or expired access token
1. Return an authentication error.

### API

> ### App Token (Server)


| Key      | Value                                                     |
|----------|-----------------------------------------------------------|
| endpoint | https://graph.facebook.com/oauth/access_token             |
| verb     | GET                                                       |
| Params   | client_id, client_secret, grant_type (client credentials) |
| Result   | { access_token }                                          |

> ### Debug Token

| Key      | Value                                        |
|----------|----------------------------------------------|
| endpoint | https://graph.facebook.com/oauth/debug_token |
| verb     | GET                                          |
| params   | access_token (server), client_input (client) |
| result   | { access_token }                             |

> ### User Information

| Key      | Value                                         |
|----------|-----------------------------------------------|
| endpoint | https://graph.facebook.com/{user_id}          |
| verb     | GET                                           |
| params   | fields (id,name,email), access_token (client) |
| result   | { id, name, email }                           |

---

&copy; Copyright 1995-present - [Isidro A. Lopez G.](https://ialopezg.com/)
