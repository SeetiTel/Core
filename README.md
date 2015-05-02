### Building

> You'll need node and npm set up on your system (which is beyond the scope of this README), and gulp installed (`npm install -g gulp` if you don't already have it).

1. Clone this repo & move into the directory

2. Install the dependencies:

  `npm install`

3. Build and run:

	`npm start`


### Gulp

| `gulp` command  | result |
| ------------- | ------------- |
| `gulp`  | Lint the code and concatenate all files in the `src` directory into `index.js`.  |
| `gulp watch`  | Concatenate all files in the `src` directory into `index.js` and rebuild on changes to `src`.  |
| `gulp hint`  | Lint all code. Doesn't build anything.  |
