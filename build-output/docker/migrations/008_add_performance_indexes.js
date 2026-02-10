"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const up = async (db) => {
    console.log('🔄 Running migration: 008_add_performance_indexes.ts');
    try {
        db.prepare('CREATE INDEX IF NOT EXISTS idx_auto_folder_groups_folder_path ON auto_folder_groups(folder_path)').run();
        console.log('✅ Created index: idx_auto_folder_groups_folder_path');
    }
    catch (error) {
        console.warn('⚠️  Index creation warning:', error.message);
    }
    try {
        db.prepare('CREATE INDEX IF NOT EXISTS idx_image_files_original_file_path ON image_files(original_file_path)').run();
        console.log('✅ Created index: idx_image_files_original_file_path');
    }
    catch (error) {
        console.warn('⚠️  Index creation warning:', error.message);
    }
    try {
        db.prepare('CREATE INDEX IF NOT EXISTS idx_prompt_collection_prompt ON prompt_collection(prompt)').run();
        console.log('✅ Created index: idx_prompt_collection_prompt');
    }
    catch (error) {
        console.warn('⚠️  Index creation warning:', error.message);
    }
    try {
        db.prepare('CREATE INDEX IF NOT EXISTS idx_image_groups_group_composite ON image_groups(group_id, composite_hash)').run();
        console.log('✅ Created index: idx_image_groups_group_composite');
    }
    catch (error) {
        console.warn('⚠️  Index creation warning:', error.message);
    }
    try {
        db.prepare('CREATE INDEX IF NOT EXISTS idx_api_generation_history_status_created ON api_generation_history(generation_status, created_at DESC)').run();
        console.log('✅ Created index: idx_api_generation_history_status_created');
    }
    catch (error) {
        console.warn('⚠️  Index creation warning:', error.message);
    }
    console.log('✅ All performance indexes created successfully');
};
exports.up = up;
const down = async (db) => {
    console.log('🔄 Rolling back migration: 008_add_performance_indexes.ts');
    try {
        db.prepare('DROP INDEX IF EXISTS idx_auto_folder_groups_folder_path').run();
        console.log('✅ Dropped index: idx_auto_folder_groups_folder_path');
    }
    catch (e) {
        console.warn('Failed to drop index idx_auto_folder_groups_folder_path', e);
    }
    try {
        db.prepare('DROP INDEX IF EXISTS idx_image_files_original_file_path').run();
        console.log('✅ Dropped index: idx_image_files_original_file_path');
    }
    catch (e) {
        console.warn('Failed to drop index idx_image_files_original_file_path', e);
    }
    try {
        db.prepare('DROP INDEX IF EXISTS idx_prompt_collection_prompt').run();
        console.log('✅ Dropped index: idx_prompt_collection_prompt');
    }
    catch (e) {
        console.warn('Failed to drop index idx_prompt_collection_prompt', e);
    }
    try {
        db.prepare('DROP INDEX IF EXISTS idx_image_groups_group_composite').run();
        console.log('✅ Dropped index: idx_image_groups_group_composite');
    }
    catch (e) {
        console.warn('Failed to drop index idx_image_groups_group_composite', e);
    }
    try {
        db.prepare('DROP INDEX IF EXISTS idx_api_generation_history_status_created').run();
        console.log('✅ Dropped index: idx_api_generation_history_status_created');
    }
    catch (e) {
        console.warn('Failed to drop index idx_api_generation_history_status_created', e);
    }
    console.log('✅ All indexes removed');
};
exports.down = down;
//# sourceMappingURL=008_add_performance_indexes.js.map