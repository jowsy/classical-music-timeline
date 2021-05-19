# classical-music-timeline

## Background
I had trobule finding a good interactive timeline of composers so I made one! 
The overall goal is to increase the general knowledge of music history, focusing on the western classical tradition. 

## Data
Primary datasource: OpenOpus API. Learn more at: https://openopus.org/.
On that layer, additional data are added. 

## BACKLOG
- [x] Add support for selection of composer and displaying metadata in a property window
- [ ] As a user, I want to be able to see notable events in a composer's life as a list and as points in the timeline view
- [ ] As a user, I want to be able to edit styling of bars in the timeline view (ex: change style parameter) 
- [x] Add support for number parameter and filtering
- [x] Collect IMDB soundtrack statistics and number of Spotify listeners for each composers, and map to datasource

## Frameworks
* Vue.js v.3
* Bootstrap 5
* d3.js

## Documentation
Use dependency cruiser to generate component dependency diagram.
Validation rules is defined in .dependecy-cruiser.js.
```
npx depcruise --config .dependency-cruiser.js src --include-only "^src" --output-type dot src | dot -T svg > dependencygraph.svg
```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
