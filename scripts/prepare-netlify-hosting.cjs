const fs = require("fs");
const path = require("path");

const clientDir = path.join(process.cwd(), "dist", "client");
const assetsDir = path.join(clientDir, "assets");

if (!fs.existsSync(assetsDir)) {
  throw new Error("dist/client/assets not found. Run npm run build:netlify first.");
}

const assets = fs.readdirSync(assetsDir);
const entry = assets.find((file) => /^static-main-.*\.js$/.test(file));
const styles = assets.filter((file) => /\.css$/.test(file));

if (!entry) {
  throw new Error("Could not find the Netlify client entry chunk in dist/client/assets.");
}

const cssLinks = styles
  .map((file) => `    <link rel="stylesheet" crossorigin href="/assets/${file}">`)
  .join("\n");
const cssBlock = cssLinks ? `${cssLinks}\n` : "";

const html = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BW7 Marketplace</title>
    <meta name="description" content="Marketplace BW7 Business Woman">
    <meta name="theme-color" content="#6C3FB5">
${cssBlock}  </head>
  <body>
    <div id="root"></div>
    <script type="module" crossorigin src="/assets/${entry}"></script>
  </body>
</html>
`;

fs.writeFileSync(path.join(clientDir, "index.html"), html);
console.log(`Netlify index generated with ${entry}.`);
