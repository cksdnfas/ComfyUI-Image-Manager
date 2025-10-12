"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const up = async (db) => {
    db.exec(`ALTER TABLE images ADD COLUMN optimized_path VARCHAR(500)`);
    console.log('✅ optimized_path 컬럼이 추가되었습니다.');
    try {
        db.exec(`CREATE INDEX IF NOT EXISTS idx_optimized_path ON images(optimized_path)`);
        console.log('✅ optimized_path 인덱스가 생성되었습니다.');
    }
    catch (err) {
        console.warn('Warning creating optimized_path index:', err);
    }
};
exports.up = up;
const down = async (db) => {
    try {
        db.exec(`DROP INDEX IF EXISTS idx_optimized_path`);
    }
    catch (err) {
        console.warn('Warning dropping optimized_path index:', err);
    }
    db.exec(`
    CREATE TABLE images_backup (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename VARCHAR(255) NOT NULL,
      original_name VARCHAR(255) NOT NULL,
      file_path VARCHAR(500) NOT NULL,
      thumbnail_path VARCHAR(500) NOT NULL,
      file_size INTEGER NOT NULL,
      mime_type VARCHAR(100) NOT NULL,
      width INTEGER,
      height INTEGER,
      upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      metadata TEXT,
      UNIQUE(file_path)
    )
  `);
    db.exec(`
    INSERT INTO images_backup
    SELECT id, filename, original_name, file_path, thumbnail_path,
           file_size, mime_type, width, height, upload_date, metadata
    FROM images
  `);
    db.exec('DROP TABLE images');
    db.exec('ALTER TABLE images_backup RENAME TO images');
    console.log('✅ optimized_path 컬럼이 제거되었습니다.');
};
exports.down = down;
//# sourceMappingURL=002_add_optimized_path.js.map