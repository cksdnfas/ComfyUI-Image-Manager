"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const up = (db) => {
    return new Promise((resolve, reject) => {
        db.run(`
      ALTER TABLE images ADD COLUMN auto_tags TEXT;
      `, (err) => {
            if (err) {
                reject(err);
            }
            else {
                console.log('✅ Migration 005: Added auto_tags column to images table');
                resolve();
            }
        });
    });
};
exports.up = up;
const down = (db) => {
    return new Promise((resolve, reject) => {
        db.run(`
      ALTER TABLE images DROP COLUMN auto_tags;
      `, (err) => {
            if (err) {
                reject(err);
            }
            else {
                console.log('✅ Migration 005 rollback: Removed auto_tags column');
                resolve();
            }
        });
    });
};
exports.down = down;
//# sourceMappingURL=005_add_auto_tags.js.map