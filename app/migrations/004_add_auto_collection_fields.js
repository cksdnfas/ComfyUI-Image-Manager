"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const up = (db) => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run(`
        ALTER TABLE groups ADD COLUMN auto_collect_enabled BOOLEAN DEFAULT 0
      `, (err) => {
                if (err) {
                    console.error('❌ Error adding auto_collect_enabled column:', err);
                    reject(err);
                    return;
                }
                console.log('✅ auto_collect_enabled 컬럼이 추가되었습니다.');
            });
            db.run(`
        ALTER TABLE groups ADD COLUMN auto_collect_conditions TEXT
      `, (err) => {
                if (err) {
                    console.error('❌ Error adding auto_collect_conditions column:', err);
                    reject(err);
                    return;
                }
                console.log('✅ auto_collect_conditions 컬럼이 추가되었습니다.');
            });
            db.run(`
        ALTER TABLE groups ADD COLUMN auto_collect_last_run DATETIME
      `, (err) => {
                if (err) {
                    console.error('❌ Error adding auto_collect_last_run column:', err);
                    reject(err);
                    return;
                }
                console.log('✅ auto_collect_last_run 컬럼이 추가되었습니다.');
            });
            db.run(`
        ALTER TABLE image_groups ADD COLUMN collection_type VARCHAR(10) DEFAULT 'manual'
      `, (err) => {
                if (err) {
                    console.error('❌ Error adding collection_type column:', err);
                    reject(err);
                    return;
                }
                console.log('✅ collection_type 컬럼이 추가되었습니다.');
            });
            db.run(`
        ALTER TABLE image_groups ADD COLUMN auto_collected_date DATETIME
      `, (err) => {
                if (err) {
                    console.error('❌ Error adding auto_collected_date column:', err);
                    reject(err);
                    return;
                }
                console.log('✅ auto_collected_date 컬럼이 추가되었습니다.');
            });
            const indexes = [
                { name: 'idx_groups_auto_collect', table: 'groups', column: 'auto_collect_enabled' },
                { name: 'idx_image_groups_collection_type', table: 'image_groups', column: 'collection_type' },
                { name: 'idx_image_groups_auto_date', table: 'image_groups', column: 'auto_collected_date' }
            ];
            let indexCount = 0;
            indexes.forEach(index => {
                db.run(`
          CREATE INDEX IF NOT EXISTS ${index.name} ON ${index.table}(${index.column})
        `, (err) => {
                    indexCount++;
                    if (err) {
                        console.warn(`⚠️  Warning creating index ${index.name}:`, err);
                    }
                    if (indexCount === indexes.length) {
                        console.log('✅ 자동수집 관련 인덱스가 설정되었습니다.');
                        resolve();
                    }
                });
            });
        });
    });
};
exports.up = up;
const down = (db) => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            const indexes = [
                'idx_groups_auto_collect',
                'idx_image_groups_collection_type',
                'idx_image_groups_auto_date'
            ];
            indexes.forEach(indexName => {
                db.run(`DROP INDEX IF EXISTS ${indexName}`, (err) => {
                    if (err) {
                        console.warn(`⚠️  Warning dropping index ${indexName}:`, err);
                    }
                });
            });
            console.log('⚠️  SQLite에서는 컬럼 삭제가 복잡합니다. 필요시 수동으로 처리하세요.');
            resolve();
        });
    });
};
exports.down = down;
//# sourceMappingURL=004_add_auto_collection_fields.js.map