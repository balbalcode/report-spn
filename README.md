# SPN Web Managament 

[![N|Solid](https://spn-mgmt.s3-ap-southeast-1.amazonaws.com/assets/mgmt/small-public-spn.png)](https://nodesource.com/products/nsolid)

## Tech stack
* NUXT JS -> next VueJs application
* Vue JS -> progressive javascript framework for frontend
* Bootstrap Vue -> layout and theming
* Axios -> http request
* Chart JS -> chart and statistics 
* Storybook -> component documentation
* Cypress -> temporary UI testing
* Jest -> unit testing
* Vue test utils -> unit testing 

Management Front End for SPN and another vendor

## Installation
1. Before start build or install this source code, please copy one of style file in folder build/ 
into file in _color.scss (folder assets/init, create if doesn't exist) 
2. fill the environment file first create and fill the environtment file with following contain 
   ```shell
   BASE_URL=
   VERSION_CODE=
   BASE_ASSET_URL=
   ASSET_URL=
   APP_TITLE=
   MAPS_TOKEN=
   SENTRY_DSN=
   PRIMARY_COLOR=
   FIREBASE_apiKey=
   FIREBASE_authDomain=
   FIREBASE_projectId=
   FIREBASE_storageBucket=
   FIREBASE_messagingSenderId=
   FIREBASE_appId=
   FIREBASE_measurementId=
    ```
    or you can see the env.example
3. Run script npm install
   ```shell
   npm install
    ```
4. Then run project based on build case
    
   ### Compiles and hot-reloads for development    
    ```shell
   npm run dev
    ```
    it's will be start the development mode this project, default port is 3883. so you can access it on http://localhost:8000/
    
    #
    ### Compiles and minifies for production 
    ```shell
   npm run build
   npm run generate
    ```
    it's will be generate static file in directory /dist. hit the index.html for running the project

   #
    ### Unit Testing
   We're using [Jest](https://jestjs.io/) and [Vue test utilis](https://v1.test-utils.vuejs.org/). for run jest you can 
   ```shell
   npm run test:unit
   ```

   #
    ### Storybook
   Our component was documented in our storybook, we haven't finished all documentation for our component. to run story book we should build them by run command
   ```shell
   npm run build-storybook
   ```
   after that you can run 
   ```shell
   npm run storybook
   ```
   the storybook will automatically open your browser or you can access in http://localhost:6006
   #
    ### UI Testing
   We're using cypress for doing a UI test, we're using cypress. 
   Before run UI testing make sure your local/server was installed npx. Or you can install npx with command 
   ```shell
   npm i npx
   ```
   then run 
   ```shell
   npm run test:e2e
   ```
   it's automatically open cypress windows and you can select the test who wants to run
    #### we're move testing branch to [spn-management-ui](https://github.com/soulparking/spn-management-ui-test)
