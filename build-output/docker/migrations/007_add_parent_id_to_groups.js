"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const up = async (db) => {
    console.log('🔄 Running migration: 007_add_parent_id_to_groups.ts');
    try {
        db.prepare('ALTER TABLE prompt_groups ADD COLUMN parent_id INTEGER DEFAULT NULL').run();
        db.prepare('CREATE INDEX IF NOT EXISTS idx_prompt_groups_parent ON prompt_groups(parent_id)').run();
    }
    catch (error) {
        if (!error.message.includes('duplicate column name')) {
            throw error;
        }
    }
    try {
        db.prepare('ALTER TABLE negative_prompt_groups ADD COLUMN parent_id INTEGER DEFAULT NULL').run();
        db.prepare('CREATE INDEX IF NOT EXISTS idx_negative_prompt_groups_parent ON negative_prompt_groups(parent_id)').run();
    }
    catch (error) {
        if (!error.message.includes('duplicate column name')) {
            throw error;
        }
    }
};
exports.up = up;
const down = async (db) => {
    try {
        db.prepare('ALTER TABLE prompt_groups DROP COLUMN parent_id').run();
    }
    catch (e) {
        console.warn('Failed to drop column from prompt_groups', e);
    }
    try {
        db.prepare('ALTER TABLE negative_prompt_groups DROP COLUMN parent_id').run();
    }
    catch (e) {
        console.warn('Failed to drop column from negative_prompt_groups', e);
    }
};
exports.down = down;
//# sourceMappingURL=007_add_parent_id_to_groups.js.map