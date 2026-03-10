const fs = require("fs");

const svgContent = fs.readFileSync("public/logo-.svg", "utf-8");

// Split into lines
const lines = svgContent.split("\n");
const newLines = [];

for (const line of lines) {
    if (line.includes("<path") && line.includes("fill=\"#")) {
        // Keep only paths if they have bright colors
        // A, B, C, D, E, F are bright, plus 4,5,6,7,8,9
        const isBright = /fill="#([4-9a-fA-F])/.test(line);
        if (isBright) {
            newLines.push(line);
        }
    } else {
        newLines.push(line);
    }
}

fs.writeFileSync("public/logo-.svg", newLines.join("\n"));
console.log("SVG cleaned successfully! Removed dark paths.");
