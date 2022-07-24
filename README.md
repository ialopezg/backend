<div align="center">
  <img height="85" src="https://ialopezg.com/packages/corejs/corejs-logo.png" alt="CoreJS Logo" />
</div>

<div align="center">
  :zap: <strong>Backend Module</strong> :zap:
</div>
<br />

## Description

[CoreJS - Backend](https://github.com/ialopezg/corejs) is a toolset that helps you to develop and debug modern applications. This tool is made to be used in [Node.js](https://nodejs.org), which allows you to easily build efficient, scalable applications. It uses modern JavaScript, is built with [TypeScript](https://typescriptlang.org) and bring best JavaScript concepts.

## Getting started ✨

```bash
# 1. Clone the repository
git clone https://github.com/ialopezg/backend.git

# 2. Enter your newly-cloned folder
cd backend

# 3. Install dependencies
npm install

# 4. Start the server
npm run start
```

## Features

Compatible with both TypeScript and ES6 (Recommend to use [TypeScript](https://www.typescriptlang.org/)

### Available modules

- [Preferences](docs/modules/preferences.md): Global preferences.
- `Mailer`: Global email.
- `Users`: User management.
- `Auth`: Authorization and authentication management.
- `Token`: Token management, provision, and renew.

## People

Author - [Isidro A. Lopez G.](https://github.com/ialopezg)

## License

CoreJS - Backend under [MIT](LICENSE) license.

---

&copy; Copyright 1995-present - [Isidro A. Lopez G.](https://ialopezg.com/)

```html
<script>
  window.fbAsyncInit = function() {
    FB.init({
      appId      : '1249950735404556',
      cookie     : true,
      xfbml      : true,
      version    : '{api-version}'
    });

    FB.AppEvents.logPageView();

  };

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
</script>
```

comprobar estado
```javascript
FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
});
```
response
```javascript
{
    status: 'connected',
    authResponse: {
        accessToken: '...',
        expiresIn:'...',
        signedRequest:'...',
        userID:'...'
    }
}
```

```javascript
function checkLoginState() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
}
```
