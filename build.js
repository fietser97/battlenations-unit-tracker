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
    const outputPath = path.join(DEST, file.replace(/\.js$/, ".min.js"));

    const code = await fs.readFile(inputPath, "utf8");
    const result = await terser.minify(code);

    await fs.outputFile(outputPath, result.code);
    console.log(`Minified JS: ${outputPath}`);
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

// Customize your file list
async function run() {
    await minifyJS("js/main.js");
    copyStatic("data/unit_data.json");

// Replace reference in HTML
    updateHtmlScriptReference("index.html", {
        '<script src="js/main.js"></script>': '<script src="js/main.min.js"></script>'
    });

    copyStatic("css/styles.css");
}

run();