import Express from "express";
import * as fs from "fs";
import * as path from "path";

interface Options {
  vars?: any;
  logging?: boolean;
  dir?: string;
  ext?: string;
}

const renderStatic = (options: Options = {}) => {
  options.vars = options.vars || {};

  let log = (...msgs: any[]) => {
    if (options.logging) {
      console.log(...msgs);
    }
  };
  let router = Express.Router();
  router.get(
    "*",
    (
      req: Express.Request,
      res: Express.Response,
      next: Express.NextFunction
    ) => {
      let url = req.originalUrl;
      let render = (file: string) => res.render(file, options.vars);

      // Normalize ext/dir
      let dir = options.dir || req.app.get("views") || "./views";
      if (!path.isAbsolute(dir)) {
        dir = path.normalize(`./${dir}`);
      }
      let ext = options.ext || req.app.get("view engine") || "pug";
      if (ext.startsWith(".")) {
        ext = ext.substring(1);
      }

      // Render index
      if (["/", "/index", "/index.html"].includes(url)) {
        log("Rendering index");
        render("./index");
        return;
      }

      // Strip leading and trailing /, and remove .html from URLs
      if (url.charAt(0) === "/") {
        url = url.substring(1);
      }
      if (url.charAt(url.length - 1) === "/") {
        url = url.substring(0, url.length - 1);
      } else if (url.substring(url.length - ".html".length) === ".html") {
        url = url.substring(0, url.length - ".html".length);
      }

      // Check if file exists or index file exists in dir
      if (fs.existsSync(path.normalize(`${dir}/${url}.${ext}`))) {
        log("Rendering " + url);
        render(url);
      } else if (fs.existsSync(path.normalize(`${dir}/${url}/index.${ext}`))) {
        log("Rendering " + url + "/index");
        render(`${url}/index`);
      } else {
        next();
      }
    }
  );
  return router;
};

export default renderStatic;
export { renderStatic };
