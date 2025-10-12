"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const up = async (db) => {
    db.exec(`ALTER TABLE images ADD COLUMN auto_tags TEXT`);
    console.log('✅ Migration 005: Added auto_tags column to images table');
};
exports.up = up;
const down = async (db) => {
    db.exec(`ALTER TABLE images DROP COLUMN auto_tags`);
    console.log('✅ Migration 005 rollback: Removed auto_tags column');
};
exports.down = down;
//# sourceMappingURL=005_add_auto_tags.js.map