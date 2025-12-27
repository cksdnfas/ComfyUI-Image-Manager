"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const up = async (db) => {
    console.log('🔄 Running migration: 006_create_auto_prompt_tables.ts');
    db.prepare(`
    CREATE TABLE IF NOT EXISTS auto_prompt_collection (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      prompt TEXT NOT NULL,
      usage_count INTEGER DEFAULT 0,
      group_id INTEGER,
      synonyms TEXT, -- JSON array string
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `).run();
    db.prepare('CREATE INDEX IF NOT EXISTS idx_auto_prompt_collection_prompt ON auto_prompt_collection(prompt)').run();
    db.prepare('CREATE INDEX IF NOT EXISTS idx_auto_prompt_collection_usage ON auto_prompt_collection(usage_count DESC)').run();
    db.prepare('CREATE INDEX IF NOT EXISTS idx_auto_prompt_collection_group ON auto_prompt_collection(group_id)').run();
    db.prepare(`
    CREATE TABLE IF NOT EXISTS auto_prompt_groups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      group_name TEXT NOT NULL UNIQUE,
      display_order INTEGER DEFAULT 0,
      is_visible INTEGER DEFAULT 1,
      parent_id INTEGER, -- 계층 구조를 위한 부모 그룹 ID
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `).run();
    db.prepare('CREATE INDEX IF NOT EXISTS idx_auto_prompt_groups_order ON auto_prompt_groups(display_order)').run();
    db.prepare('CREATE INDEX IF NOT EXISTS idx_auto_prompt_groups_parent ON auto_prompt_groups(parent_id)').run();
};
exports.up = up;
const down = async (db) => {
    console.log('🔄 Reverting migration: 006_create_auto_prompt_tables.ts');
    db.prepare('DROP TABLE IF EXISTS auto_prompt_collection').run();
    db.prepare('DROP TABLE IF EXISTS auto_prompt_groups').run();
};
exports.down = down;
//# sourceMappingURL=006_create_auto_prompt_tables.js.map