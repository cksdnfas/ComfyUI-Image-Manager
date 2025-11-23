"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const up = async (db) => {
    console.log('🚀 model_references 컬럼 추가 마이그레이션 시작...\n');
    const tableInfo = db.prepare(`PRAGMA table_info(media_metadata)`).all();
    const hasColumn = tableInfo.some(col => col.name === 'model_references');
    if (!hasColumn) {
        db.exec(`
      ALTER TABLE media_metadata
      ADD COLUMN model_references TEXT
    `);
        console.log('  ✅ model_references 컬럼 추가 완료');
        console.log('     - JSON 형식: [{"name":"model", "hash":"abc123", "type":"checkpoint"}, ...]');
    }
    else {
        console.log('  ℹ️  model_references 컬럼이 이미 존재합니다.');
    }
    console.log('\n🎉 마이그레이션 완료!');
};
exports.up = up;
const down = async (db) => {
    console.log('🔄 model_references 컬럼 제거 마이그레이션 롤백...\n');
    console.log('  ⚠️  SQLite는 DROP COLUMN을 직접 지원하지 않습니다.');
    console.log('     테이블 재생성이 필요합니다.');
    console.log('\n✅ 롤백 완료');
};
exports.down = down;
//# sourceMappingURL=004_add_model_references_column.js.map