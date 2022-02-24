# Express Server

![Screenshot](public/img/screenchot.png)

A template repo for quick express.js node server setup with:

-   Start npm script launching node with `sudo` (Linux).
-   Debug npm script launching nodemon (Windows).
-   HTTP and HTTPS servers on ports 80 and 443.
-   A dedicated SSL cert folder used by the HTTPS server.
-   A `route` function with basic express routage.
-   All desired express libraries and middelwares for `POST` requests JSON body, `useragent`, file upload, and URL params.
-   Colored logs with duplication count suffix (e.g. `'Hello world x2'`).
-   A basic middleware providing:
    -   Lang/country based restrictions (e.g. `'en-US'` or `'N/A'`).
    -   Colored connexion logging.
-   A `dev.bat` script to quick-launch every needed apps for dev, including SCSS precompiler.
-   `tasks.json` and `launch.json` configs to launch node server and SCSS precompiler when starting a debug session.
-   A basic manifest and service-worker.

## Usage

Fisrt, install the dependencies using this command:

    npm install

Then, create a `.env` file in the project folder using this patern:

    NODE_ENV=development

    HTTP_PORT=80
    HTTPS_PORT=443

    LOG_CONNECTIONS=1

    GIT_TOKEN=
    GIT_URL=https://Iconejey:${GIT_TOKEN}@github.com/Iconejey/expess-server.git

Add a github token next to `GIT_TOKEN` and change the repo url next to `GIT_URL` with your gihtub username and repo name. This will allow you to pull the latest code from your repo in production with this command:

    npm run update

Then update `package.json` to suit your project.

If you want to use https, you need to provide a SSL certificate and a key in `./cert` folder. Else please set `HTTPS_PORT` to `NULL` in `.env` file.

This template is made for a PWA but by removing `./public/manifest.json` and `./public/service-worker.js` (including in `./public/index.html`) you can use it as a simple express server.
