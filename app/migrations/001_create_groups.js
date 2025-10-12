"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const up = async (db) => {
    db.exec(`
    CREATE TABLE IF NOT EXISTS groups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(255) NOT NULL UNIQUE,
      description TEXT,
      color VARCHAR(7),
      parent_id INTEGER,
      created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (parent_id) REFERENCES groups(id) ON DELETE SET NULL
    )
  `);
    console.log('✅ Groups 테이블이 생성되었습니다.');
    db.exec(`
    CREATE TABLE IF NOT EXISTS image_groups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      group_id INTEGER NOT NULL,
      image_id INTEGER NOT NULL,
      added_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      order_index INTEGER DEFAULT 0,
      FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
      FOREIGN KEY (image_id) REFERENCES images(id) ON DELETE CASCADE,
      UNIQUE(group_id, image_id)
    )
  `);
    console.log('✅ Image_groups 테이블이 생성되었습니다.');
    const indexes = [
        { name: 'idx_groups_parent_id', table: 'groups', column: 'parent_id' },
        { name: 'idx_groups_created_date', table: 'groups', column: 'created_date' },
        { name: 'idx_image_groups_group_id', table: 'image_groups', column: 'group_id' },
        { name: 'idx_image_groups_image_id', table: 'image_groups', column: 'image_id' },
        { name: 'idx_image_groups_added_date', table: 'image_groups', column: 'added_date' },
        { name: 'idx_image_groups_order', table: 'image_groups', column: 'order_index' }
    ];
    indexes.forEach(index => {
        try {
            db.exec(`CREATE INDEX IF NOT EXISTS ${index.name} ON ${index.table}(${index.column})`);
        }
        catch (err) {
            console.warn(`⚠️  Warning creating index ${index.name}:`, err);
        }
    });
    console.log('✅ 그룹 관련 인덱스가 설정되었습니다.');
    try {
        db.prepare(`INSERT OR IGNORE INTO groups (name, description, color) VALUES (?, ?, ?)`).run('즐겨찾기', '즐겨찾는 이미지들', '#f59e0b');
        console.log('✅ 기본 그룹이 생성되었습니다.');
    }
    catch (err) {
        console.warn('⚠️  Warning creating default group:', err);
    }
};
exports.up = up;
const down = async (db) => {
    const indexes = [
        'idx_groups_parent_id',
        'idx_groups_created_date',
        'idx_image_groups_group_id',
        'idx_image_groups_image_id',
        'idx_image_groups_added_date',
        'idx_image_groups_order'
    ];
    indexes.forEach(indexName => {
        try {
            db.exec(`DROP INDEX IF EXISTS ${indexName}`);
        }
        catch (err) {
            console.warn(`⚠️  Warning dropping index ${indexName}:`, err);
        }
    });
    db.exec('DROP TABLE IF EXISTS image_groups');
    console.log('✅ Image_groups 테이블이 삭제되었습니다.');
    db.exec('DROP TABLE IF EXISTS groups');
    console.log('✅ Groups 테이블이 삭제되었습니다.');
};
exports.down = down;
//# sourceMappingURL=001_create_groups.js.map