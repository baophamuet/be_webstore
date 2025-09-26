// models/index.js
'use strict';
import { readdirSync } from 'node:fs';
import { basename as pathBasename, join, dirname, extname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import Sequelize from 'sequelize';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const currentFileBasename = pathBasename(__filename);

const env = process.env.NODE_ENV || 'development';

// load config
const configPath = join(__dirname, '../config/config.js');
const configURL = pathToFileURL(configPath).href;
const configModule = await import(configURL);
const cfg = (configModule.default || configModule)[env];
if (!cfg) throw new Error(`Missing config for env=${env}`);

let sequelize;
if (cfg.use_env_variable) {
  const url = process.env[cfg.use_env_variable];
  if (!url) throw new Error(`Missing env var ${cfg.use_env_variable}`);
  sequelize = new Sequelize(url, cfg);
} else {
  sequelize = new Sequelize(cfg.database, cfg.username, cfg.password, cfg);
}

const db = {};

// load tất cả model .js/.mjs (trừ index/test)
const modelFiles = readdirSync(__dirname).filter(f => {
  const ext = extname(f);
  return !f.startsWith('.') &&
         f !== currentFileBasename &&
         !f.includes('.test.') &&
         !f.endsWith('.d.ts') &&
         (ext === '.js' || ext === '.mjs');
});

for (const file of modelFiles) {
  const mod = await import(pathToFileURL(join(__dirname, file)).href);
  const factory = mod.default;
  if (typeof factory !== 'function') {
    console.warn(`[models/index] Skip "${file}" (no default factory).`);
    continue;
  }
  const model = factory(sequelize, Sequelize.DataTypes);
  if (!model?.name) {
    console.warn(`[models/index] Skip "${file}" (model has no name).`);
    continue;
  }
  db[model.name] = model;
  console.log(`[models/index] Loaded model: ${model.name}`);
}

// gọi associate sau khi load hết
for (const name of Object.keys(db)) {
  const m = db[name];
  if (typeof m.associate === 'function') {
    console.log(`[models/index] Calling associate for: ${name}`);
    try {
      m.associate(db);
    } catch (e) {
      console.error(`[models/index] associate() FAILED for "${name}":`, e);
      throw e; // QUAN TRỌNG: đừng nuốt lỗi — để crash sớm cho dễ sửa
    }
  }
}

// in danh sách alias để xác nhận
for (const name of Object.keys(db)) {
  const aliases = Object.keys(db[name].associations || {});
  console.log(`[models/index] Associations of ${name}:`, aliases);
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;
export default db;
