# `express-renderer-middleware`

Middleware for [Express.JS](https://expressjs.com/) which allows for automatic template engine rendering.

[![npm](https://img.shields.io/npm/v/express-renderer-middleware.svg?style=flat-square)](https://www.npmjs.com/package/express-renderer-middleware)

[![GitHub license](https://img.shields.io/github/license/maxwellainatchi/express-renderer-middleware.svg?style=flat-square)](https://github.com/maxwellainatchi/express-renderer-middleware)
[![GitHub issues](https://img.shields.io/github/issues/maxwellainatchi/express-renderer-middleware.svg?style=social)](https://github.com/maxwellainatchi/express-renderer-middleware/issues)
[![GitHub forks](https://img.shields.io/github/forks/maxwellainatchi/express-renderer-middleware.svg?style=social)](https://github.com/maxwellainatchi/express-renderer-middleware/network)
[![GitHub stars](https://img.shields.io/github/stars/maxwellainatchi/express-renderer-middleware.svg?style=social)](https://github.com/maxwellainatchi/express-renderer-middleware/stargazers)

![CircleCI](https://img.shields.io/circleci/project/github/maxwellainatchi/express-renderer-middleware.svg?style=flat-square)
![David](https://img.shields.io/david/maxwellainatchi/express-renderer-middleware.svg?style=flat-square)
![David](https://img.shields.io/david/dev/maxwellainatchi/express-renderer-middleware.svg?style=flat-square)

**WARNING**: I have not yet been able to figure out the file extension dynamically from Express. I'm using the name of the engine for now (works with pug, ejs, and some others, but fails on some engines, including _placeholder_). If your engine's file extension does not match its name, please pass the `ext` option.

## Why?
`express-renderer-middleware` significantly cuts down on the amount of code needed to render a directory of files.

### Without `express-renderer-middleware`
```javascript
let app = (require("express"))();
app.set("view engine", "pug");
// ...

app.get("/", (req, res) => {
	res.render("index");
});

app.get("/somePage", (req, res) => {
	res.render("somePage");
})

app.get("/otherPage", (req, res) => {
	res.render("otherPage");
})

// ... Repeat for each page ...
// ... other routes ...

app.listen(port);
```

### With `express-renderer-middleware`
```javascript
let app = (require("express"))();
let renderer = require("express-renderer-middleware");
app.set("view engine", "pug");

// ...

app.use(renderer());

//... other routes ...

app.listen(port);
```

## Reference
### `app.use(renderer(`_`options`_`))`
Renders all files in the views directory automatically.

#### Params
| Name | Type | Description | Default |
| - | - | - | - |
| options.vars | _object_ | Variables to be passed to `res.render(file, vars)`. | `{}` |
| options.dir | _string_ | The directory to lookup views in. | `app.get("views") || "./views"` |
| options.ext | _string_ | The file extension to use when checking for views | `app.get("view engine") || ".pug"`

## URL Mappings
| URL | File on server (relative to views folder) |
|-|-|
| `/` |`index.<ext>` |
| `/<filename>` | `<filename>.<ext>` |
| `/<filename>.html` | `<filename>.<ext>` |
| `/<foldername>` | `<foldername>/index.<ext>` |
| `/<foldername>.html` | `<foldername/index.<ext>` |
| `/<foldername>/<filename>` | `<foldername>/<filename>.<ext>` |
| `/<foldername>/<foldername>` | `<foldername>/<foldername>/index.<ext>` |

**NOTE:**
`/<filename>.<ext>` is intentionally not mapped, in case you want to use in conjunction with `Express.static` to serve the source files.

## Installation

This is a Node.js module available through the npm registry.

Before installing, download and install Node.js.

Installation is done using the npm install command:

```sh
npm install express-renderer-middleware --save
```
