"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const up = async (db) => {
    console.log('🔧 Adding watcher_polling_interval column to watched_folders...');
    const tableInfo = db.pragma('table_info(watched_folders)');
    const columnExists = tableInfo.some((col) => col.name === 'watcher_polling_interval');
    if (!columnExists) {
        db.exec(`
      ALTER TABLE watched_folders
      ADD COLUMN watcher_polling_interval INTEGER DEFAULT NULL
    `);
        console.log('  ✅ watcher_polling_interval column added (default: NULL = auto-detect)');
    }
    else {
        console.log('  ⏭️  Column already exists, skipping...');
    }
    console.log('✅ Migration complete\n');
};
exports.up = up;
const down = async (db) => {
    console.log('⚠️  Rolling back watcher_polling_interval column...');
    console.log('  ⚠️  SQLite does not support DROP COLUMN easily.');
    console.log('  ⚠️  Manual intervention required if rollback is needed.');
    console.log('  ⚠️  Consider recreating the table or leaving the column as-is.');
};
exports.down = down;
//# sourceMappingURL=002_add_watcher_polling_interval.js.map