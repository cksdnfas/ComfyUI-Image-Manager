"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const up = async (db) => {
    const alterQueries = [
        'ALTER TABLE images ADD COLUMN ai_tool VARCHAR(50)',
        'ALTER TABLE images ADD COLUMN model_name VARCHAR(200)',
        'ALTER TABLE images ADD COLUMN lora_models TEXT',
        'ALTER TABLE images ADD COLUMN steps INTEGER',
        'ALTER TABLE images ADD COLUMN cfg_scale REAL',
        'ALTER TABLE images ADD COLUMN sampler VARCHAR(100)',
        'ALTER TABLE images ADD COLUMN seed BIGINT',
        'ALTER TABLE images ADD COLUMN scheduler VARCHAR(100)',
        'ALTER TABLE images ADD COLUMN prompt TEXT',
        'ALTER TABLE images ADD COLUMN negative_prompt TEXT',
        'ALTER TABLE images ADD COLUMN denoise_strength REAL',
        'ALTER TABLE images ADD COLUMN generation_time REAL',
        'ALTER TABLE images ADD COLUMN batch_size INTEGER',
        'ALTER TABLE images ADD COLUMN batch_index INTEGER'
    ];
    alterQueries.forEach((query, index) => {
        db.exec(query);
        console.log(`✅ AI 메타데이터 컬럼 ${index + 1}/${alterQueries.length} 추가됨`);
    });
    const indexQueries = [
        'CREATE INDEX IF NOT EXISTS idx_ai_tool ON images(ai_tool)',
        'CREATE INDEX IF NOT EXISTS idx_model_name ON images(model_name)',
        'CREATE INDEX IF NOT EXISTS idx_sampler ON images(sampler)',
        'CREATE INDEX IF NOT EXISTS idx_seed ON images(seed)'
    ];
    indexQueries.forEach((indexQuery) => {
        try {
            db.exec(indexQuery);
        }
        catch (err) {
            console.warn('Warning creating index:', err);
        }
    });
    console.log('✅ AI 메타데이터 인덱스가 생성되었습니다.');
};
exports.up = up;
const down = async (db) => {
    const dropIndexQueries = [
        'DROP INDEX IF EXISTS idx_ai_tool',
        'DROP INDEX IF EXISTS idx_model_name',
        'DROP INDEX IF EXISTS idx_sampler',
        'DROP INDEX IF EXISTS idx_seed'
    ];
    dropIndexQueries.forEach((query) => {
        try {
            db.exec(query);
        }
        catch (err) {
            console.warn('Warning dropping index:', err);
        }
    });
    db.exec(`
    CREATE TABLE images_backup (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename VARCHAR(255) NOT NULL,
      original_name VARCHAR(255) NOT NULL,
      file_path VARCHAR(500) NOT NULL,
      thumbnail_path VARCHAR(500) NOT NULL,
      optimized_path VARCHAR(500),
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
    SELECT id, filename, original_name, file_path, thumbnail_path, optimized_path,
           file_size, mime_type, width, height, upload_date, metadata
    FROM images
  `);
    db.exec('DROP TABLE images');
    db.exec('ALTER TABLE images_backup RENAME TO images');
    console.log('✅ AI 메타데이터 컬럼들이 제거되었습니다.');
};
exports.down = down;
//# sourceMappingURL=003_add_ai_metadata_columns.js.map