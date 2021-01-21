#Flickr Gallery

VanillaJS web-components based app that loads images from the Flickr API and displays them.

##Features
1. Build using the WebComponents API, ensuring encapsulated component css
2. Main view with associated actions
3. Thumbnail view of the loaded images with click interaction
4. Mouse/Touch swipe interaction
5. Keyboard interaction -> use left/right arrows to navigate between pages
6. Dismissable alert popups with ability to execute custom action (used to inform the user of issues requesting the images)
7. User feedback on loading images
8. Endless scroll implementation

##Local Setup
```bash
# install devDependencies
npm install

# lint
npm run lint

# prettier format
npm run format

# run locally
npm run start:dev
# it will start up webpack serve
# open up http://localhost:8080 to view the rendered app

# bundle the app
# > lint
# > compile to ES5
# > minify
# > concatenate
npm run build
# output can be found in dist/ directory
```
