#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const createProjectStructure = (projectName) => {
  console.log(`Creating project structure for ${projectName}...`);

  createProjectDirectory(projectName)
  initNPN();
  modifyPackageJSON();
  installDevelopmentDependencies();
  createTypeScriptConfiguration();
  createESLintConfiguration();
  createPrettierConfig();
  installDependencies();
  createDotEnvConfig();
  createBasicFileStructure();
  createReadmeFile(projectName);
};

const createProjectDirectory = (projectName) => {
  console.log(`Creating project directory...`);

  fs.mkdirSync(projectName);
  process.chdir(projectName);
}

const initNPN = () => {
  console.log(`Initializing npm...`);

  execSync("npm init -y");
};

const modifyPackageJSON = () => {
  console.log(`Modifying package.json file...`);

  const packageJsonPath = path.join(process.cwd(), "package.json");
  const packageJson = require(packageJsonPath);

  packageJson.scripts = {
    dev: "nodemon --watch src/**/*.ts --exec ts-node ./src/app.ts",
    build: "tsc",
    start: "node ./dist/index.js",
    prestart: "npm run build",
    lint: "eslint --fix --quiet src/**/*.ts",
    format: "prettier --log-level silent --write src/**/*.ts"
  };
  packageJson.main = "src/index.ts";

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
};

const installDevelopmentDependencies = () => {
  console.log(`Initializing npm dev dependencies...`);

  execSync('npm install --save-dev @types/node @types/superagent @typescript-eslint/eslint-plugin ' +
    '@typescript-eslint/parser eslint eslint-config-prettier eslint-plugin-prettier nodemon prettier ' +
    'ts-node typescript typescript-eslint-parser');
};

const installDependencies = () => {
  console.log(`Initializing npm dependencies...`);

  execSync('npm install --save dotenv');
};

const createTypeScriptConfiguration = () => {
  console.log(`Creating TypeScript configuration...`);

  const tsconfigContent = {
      "compilerOptions": {
        "module": "commonjs",
        "moduleResolution": "node",
        "pretty": true,
        "resolveJsonModule": true,
        "sourceMap": true,
        "target": "es2021",
        "outDir": "./dist",
        "baseUrl": "./src",
        "experimentalDecorators": true,
        "strict": true
      },
      "include": ["src/**/*.ts"],
      "exclude": ["node_modules", "src/**/*.spec.ts"]
    };

  fs.writeFileSync("tsconfig.json", JSON.stringify(tsconfigContent, null, 2));
};

const createESLintConfiguration = () => {
  console.log(`Creating ESLint configuration...`);

  const ignoreContent = '# node modules\n' +
    'node_modules\n' +
    '# build path\n' +
    'dist\n' +
    '# environmental variables\n' +
    '.env\n' +
    '# yarn error log\n' +
    'yarn-error.log\n' +
    '# vscode config\n' +
    '.vscode\n' +
    '# test coverage\n' +
    'coverage';

  fs.writeFileSync(".eslintignore", ignoreContent);

  const rcContent = 'module.exports = {\n' +
    '  parser: \'@typescript-eslint/parser\',\n' +
    '  plugins: [\'prettier\', \'@typescript-eslint\'],\n' +
    '  parserOptions: {\n' +
    '    project: \'./tsconfig.json\',\n' +
    '    ecmaVersion: 2021,\n' +
    '    sourceType: \'module\',\n' +
    '  },\n' +
    '  extends: [\n' +
    '    \'plugin:@typescript-eslint/recommended\',\n' +
    '    \'plugin:prettier/recommended\',\n' +
    '  ],\n' +
    '  ignorePatterns: [\'.eslintrc.js\'],\n' +
    '  rules: {\n' +
    '    \'@typescript-eslint/array-type\': [\'error\', { default: \'array-simple\' }],\n' +
    '    \'@typescript-eslint/no-explicit-any\': [\'off\'],\n' +
    '    \'@typescript-eslint/no-unused-vars\': [\n' +
    '      \'warn\',\n' +
    '      { argsIgnorePattern: \'^_\', varsIgnorePattern: \'^_\' },\n' +
    '    ],\n' +
    '    semi: [\'error\', \'always\'],\n' +
    '  },\n' +
    '};\n';

  fs.writeFileSync(".eslintrc.js", rcContent);
};

const createPrettierConfig = () => {
  console.log(`Creating Prettier configuration...`);

  const prettierConfigContent = {
      "trailingComma": "all",
      "tabWidth": 2,
      "semi": true,
      "singleQuote": true
    };

  fs.writeFileSync(".prettierrc.json", JSON.stringify(prettierConfigContent, null, 2));
};

const createDotEnvConfig = () => {
  console.log(`Creating .env configuration...`);

  const content = "DATABASE_URL=bolt://localhost:7687"

  fs.writeFileSync(".env.example", content);
};

const createBasicFileStructure = () => {
  console.log(`Creating basic file structure...`);

  execSync("mkdir src");

  fs.writeFileSync("README.md", `# ${projectName}`);
  fs.writeFileSync("./src/index.ts", `import * as dotenv from 'dotenv';
dotenv.config();

console.log('Hello!');`);
};

const createReadmeFile = (projectName) => {
  console.log(`Creating README.md file...`);

  fs.writeFileSync("README.md", `# ${projectName}`);
};

const projectName = process.argv[2];

if (!projectName) {
  console.error("Please provide a project name.");
  process.exit(1);
}

createProjectStructure(projectName);

console.log("Project initialization complete!");
