<div align="center">
  <img height="85" src="https://ialopezg.com/packages/corejs/corejs-logo.png" alt="CoreJS Logo" />
</div>

<div align="center">
  :zap: <strong>Backend Server Layer</strong> :zap:
</div>
<br />

# Auth Module

## Facebook Authentication

### Required Data
* Access Token

### Common case

> If user arrives at first time

1. Get user profile data (name, email, facebook ID) from Facebook API.
2. Verify if user exists into the database.
     * If no exists, creates a new account with data received from Facebook API and continue with next step.
3. Creates a token access for given user ID, with time expiration.
4. Return generated access token.

### Alternative case

> If user account exists with returned email profile fro Facebook API

1. Update user account with data retrieved from Facebook API.
2. Creates a token access for given user ID, with time expiration.
3. Return generated access token.

### Exception case

> If user provide invalid or expired access token
1. Return an authentication error.

---

&copy; Copyright 1995-present - [Isidro A. Lopez G.](https://ialopezg.com/)
