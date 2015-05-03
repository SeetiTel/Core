### Building

> You'll need node and npm set up on your system (which is beyond the scope of this README), and gulp installed (`npm install -g gulp` if you don't already have it).

1. Clone this repo:

  `git clone https://github.com/SeetiTel/Core.git`


2. Move into the directory and install the dependencies:

  ```
  cd Core
  npm install
  ```

3. Build and run:

	`npm start`


### Gulp

The following gulp commands are recognized:

| `gulp` command  | result |
| ------------- | ------------- |
| `gulp`  | Lint the code and concatenate all files in the `src` directory into `index.js`.  |
| `gulp watch`  | Concatenate all files in the `src` directory into `index.js` and rebuild on changes to `src`.  |
| `gulp hint`  | Lint all code. Doesn't build anything.  |

### Development

For development, it's recommended to `git clone` and `npm install` as usual, and run `gulp watch` at the same time as `nodemon` to keep the build updated as changes roll through.
