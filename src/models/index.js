'use strict';

import { readdirSync } from 'node:fs';
import { basename as pathBasename, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import Sequelize from 'sequelize';

const __filename = fileURLToPath(import.meta.url);
const __dirname = fileURLToPath(new URL('.', import.meta.url));
const currentFileBasename = pathBasename(__filename);

const env = process.env.NODE_ENV || 'development';

// Cách import JSON an toàn cho Windows
const configPath = join(__dirname, '../config/config.json');
const configURL = pathToFileURL(configPath).href;
const config = (await import(configURL, { with: { type: 'json' } })).default[env];

const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Đọc các model files
const modelFiles = readdirSync(__dirname)
  .filter(file => (
    file.indexOf('.') !== 0 &&
    file !== currentFileBasename &&
    file.slice(-3) === '.js' &&
    file.indexOf('.test.js') === -1
  ));

// Load models
for (const file of modelFiles) {
  const filePath = join(__dirname, file);
  const fileURL = pathToFileURL(filePath).href;
  const modelModule = await import(fileURL);
  const model = modelModule.default(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
}

// Setup associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;