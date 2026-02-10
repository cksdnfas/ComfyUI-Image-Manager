"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const up = async (db) => {
    console.log('🔄 Running migration: 009_add_raw_nai_parameters.ts');
    try {
        db.prepare('ALTER TABLE media_metadata ADD COLUMN raw_nai_parameters TEXT DEFAULT NULL').run();
        console.log('✅ Added column: raw_nai_parameters to media_metadata');
    }
    catch (error) {
        if (error.message.includes('duplicate column')) {
            console.log('⚠️  Column raw_nai_parameters already exists, skipping');
        }
        else {
            throw error;
        }
    }
    console.log('✅ Migration 009 completed successfully');
};
exports.up = up;
const down = async (db) => {
    console.log('🔄 Rolling back migration: 009_add_raw_nai_parameters.ts');
    try {
        db.prepare('ALTER TABLE media_metadata DROP COLUMN raw_nai_parameters').run();
        console.log('✅ Dropped column: raw_nai_parameters');
    }
    catch (error) {
        console.warn('⚠️  Failed to drop column:', error.message);
    }
};
exports.down = down;
//# sourceMappingURL=009_add_raw_nai_parameters.js.map