const fs = require("fs-extra");
const path = require("path");
const terser = require("terser");

// Input/output folders
const SRC = "src";
const DEST = "build";

// Clean and recreate build folder
fs.removeSync(DEST);
fs.ensureDirSync(DEST);

// Minify JS
async function minifyJS(file) {
    const inputPath = path.join(SRC, file);
    const outputPath = path.join(DEST, file.replace(/\.js$/, ".js"));

    const code = await fs.readFile(inputPath, "utf8");
    const result = await terser.minify(code);

    await fs.outputFile(outputPath, result.code);
    console.log(`Minified JS: ${outputPath}`);
}
function minifyJSON(file) {
    const inputPath = path.join(SRC, file);
    const outputPath = path.join(DEST, file);

    const raw = fs.readFileSync(inputPath, "utf8");
    const parsed = JSON.parse(raw);
    const minified = JSON.stringify(parsed); // no spacing = minified

    fs.outputFileSync(outputPath, minified);
    console.log(`Minified JSON: ${outputPath}`);
}

function updateHtmlScriptReference(file, replacements) {
    const inputPath = path.join(SRC, file);
    const outputPath = path.join(DEST, file);

    let html = fs.readFileSync(inputPath, "utf8");

    // Apply all replacements (you can do more than just JS if needed)
    for (const [original, replacement] of Object.entries(replacements)) {
        html = html.replace(original, replacement);
    }

    fs.outputFileSync(outputPath, html);
    console.log(`Updated HTML: ${outputPath}`);
}

// Copy HTML/CSS
function copyStatic(file) {
    fs.copySync(path.join(SRC, file), path.join(DEST, file));
    console.log(`Copied: ${file}`);
}

// Copy icons
function copyImages(srcFolder, destFolder) {
    const inputPath = path.join(SRC, srcFolder);
    const outputPath = path.join(DEST, destFolder);

    fs.copySync(inputPath, outputPath);
    console.log(`Copied images from ${inputPath} to ${outputPath}`);
}

// Customize your file list
async function run() {
    await minifyJS("js/main.js");
    await minifyJS("js/counters.js");
    await minifyJS("js/import-export.js");
    await minifyJS("js/table-init.js");
    await minifyJS("js/tracking.js");
    await minifyJS("js/utils.js");
    minifyJSON("data/unit_data.json");

    // Replace reference in HTML
    updateHtmlScriptReference("index.html", {
        'tmpvalue':'feddevanderlist.battlenations-unit-tracker'
    });

    copyStatic("css/styles.css");
    copyStatic("robots.txt");
    copyStatic("data/banner2_1920x200.png")
    copyImages("data/icons/","data/icons/")
}

run();