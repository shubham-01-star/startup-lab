const fs = require("fs");
const path = require("path");
const ts = require("typescript");

const compilerOptions = {
  module: ts.ModuleKind.CommonJS,
  moduleResolution: ts.ModuleResolutionKind.Node10,
  target: ts.ScriptTarget.ES2020,
  esModuleInterop: true,
  experimentalDecorators: true,
  emitDecoratorMetadata: true,
  strictPropertyInitialization: false,
  resolveJsonModule: true,
  jsx: ts.JsxEmit.ReactJSX,
};

for (const extension of [".ts", ".tsx"]) {
  require.extensions[extension] = (module, filename) => {
    const source = fs.readFileSync(filename, "utf8");
    const { outputText } = ts.transpileModule(source, {
      compilerOptions,
      fileName: filename,
    });

    module._compile(outputText, filename);
  };
}

const scriptPath = process.argv[2];

if (!scriptPath) {
  console.error("Usage: node scripts/run-ts.cjs <script-path>");
  process.exit(1);
}

require(path.resolve(process.cwd(), scriptPath));
