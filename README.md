# classical-music-timeline

## Background
I wanted to learn TypeScript and had trouble finding an interactive timeline of composers and their works. 
The overall aim is to increase the general knowledge of music history, focusing on the western classical tradition. It can also be used as a quality assurance tool for validating metadata.

## Data
As primary data source I use OpenOpus but it is built to support implementation of other datasources as well. Learn more at: https://openopus.org/.


## TODO
- [ ] Add support for selection of composer and displaying metadata in a property window
- [ ] Draw works as points in time (date related to work is missing from OpenOpus, test other datasource?)
- [ ] Add support for number parameter and filtering
- [ ] Collect IMDB soundtrack statistics and number of Spotify listeners for each composers, and map to datasource

## Frameworks

* Vue.js v.3
* Bootstrap 5


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
