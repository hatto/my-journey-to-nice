# MotoGP formulaire landing page
website constructs with **react.js** and **flux** with ajax call to the **Carmen API** to store datas

## dependencies
node.js 6.4
npm 3.10
webpack, babel, gulp-webserver (installed by npm)

## Installation
```
npm install
```

## Dev
```
npm run start
```
to lance **gulp server**, than you can access website on the [http://localhost:8000](http://localhost:8000)

## build
```
npm run build [--env=production|preprod]
```

## API
**the url to the api is stored in the package.json**
for development testing, there is is file **src/data/response-test.json** which serves as an response, this file copied to the *dist* only if build environment is **dev**
