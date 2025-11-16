"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const path_1 = __importDefault(require("path"));
const up = async (db) => {
    console.log('🚀 통합 마이그레이션: 모든 테이블 생성 시작...\n');
    console.log('📝 프롬프트 수집 테이블 생성 중...');
    db.exec(`
    CREATE TABLE IF NOT EXISTS prompt_collection (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      prompt TEXT NOT NULL,
      usage_count INTEGER DEFAULT 1,
      group_id INTEGER,
      synonyms TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(prompt)
    )
  `);
    db.exec(`
    CREATE TABLE IF NOT EXISTS negative_prompt_collection (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      prompt TEXT NOT NULL,
      usage_count INTEGER DEFAULT 1,
      group_id INTEGER,
      synonyms TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(prompt)
    )
  `);
    db.exec(`
    CREATE TABLE IF NOT EXISTS prompt_groups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      group_name TEXT NOT NULL,
      display_order INTEGER NOT NULL DEFAULT 0,
      is_visible BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(group_name)
    )
  `);
    db.exec(`
    CREATE TABLE IF NOT EXISTS negative_prompt_groups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      group_name TEXT NOT NULL,
      display_order INTEGER NOT NULL DEFAULT 0,
      is_visible BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(group_name)
    )
  `);
    const promptIndexes = [
        'CREATE INDEX IF NOT EXISTS idx_prompt_usage ON prompt_collection(usage_count)',
        'CREATE INDEX IF NOT EXISTS idx_prompt_group ON prompt_collection(group_id)',
        'CREATE INDEX IF NOT EXISTS idx_negative_prompt_usage ON negative_prompt_collection(usage_count)',
        'CREATE INDEX IF NOT EXISTS idx_negative_prompt_group ON negative_prompt_collection(group_id)',
        'CREATE INDEX IF NOT EXISTS idx_prompt_groups_order ON prompt_groups(display_order)',
        'CREATE INDEX IF NOT EXISTS idx_prompt_groups_visible ON prompt_groups(is_visible)',
        'CREATE INDEX IF NOT EXISTS idx_negative_groups_order ON negative_prompt_groups(display_order)',
        'CREATE INDEX IF NOT EXISTS idx_negative_groups_visible ON negative_prompt_groups(is_visible)'
    ];
    promptIndexes.forEach(sql => db.exec(sql));
    db.prepare(`INSERT OR IGNORE INTO prompt_groups (group_name, display_order, is_visible)
    VALUES (?, ?, ?)`).run('LoRA', 999, 1);
    db.prepare(`INSERT OR IGNORE INTO negative_prompt_groups (group_name, display_order, is_visible)
    VALUES (?, ?, ?)`).run('LoRA', 999, 1);
    console.log('  ✅ 프롬프트 테이블 4개 + 인덱스 + LoRA 그룹 생성 완료\n');
    console.log('📁 그룹 관리 테이블 생성 중...');
    db.exec(`
    CREATE TABLE IF NOT EXISTS groups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR(255) NOT NULL UNIQUE,
      description TEXT,
      color VARCHAR(7),
      parent_id INTEGER,
      auto_collect_enabled BOOLEAN DEFAULT 0,
      auto_collect_conditions TEXT,
      auto_collect_last_run DATETIME,
      created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (parent_id) REFERENCES groups(id) ON DELETE SET NULL
    )
  `);
    db.exec(`
    CREATE TABLE IF NOT EXISTS image_groups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      group_id INTEGER NOT NULL,
      composite_hash TEXT NOT NULL,
      added_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      order_index INTEGER DEFAULT 0,
      collection_type VARCHAR(10) DEFAULT 'manual',
      auto_collected_date DATETIME,
      FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
      FOREIGN KEY (composite_hash) REFERENCES media_metadata(composite_hash) ON DELETE CASCADE,
      UNIQUE(group_id, composite_hash)
    )
  `);
    const groupIndexes = [
        'CREATE INDEX IF NOT EXISTS idx_groups_parent_id ON groups(parent_id)',
        'CREATE INDEX IF NOT EXISTS idx_groups_created_date ON groups(created_date)',
        'CREATE INDEX IF NOT EXISTS idx_groups_auto_collect ON groups(auto_collect_enabled)',
        'CREATE INDEX IF NOT EXISTS idx_image_groups_group_id ON image_groups(group_id)',
        'CREATE INDEX IF NOT EXISTS idx_image_groups_composite_hash ON image_groups(composite_hash)',
        'CREATE INDEX IF NOT EXISTS idx_image_groups_added_date ON image_groups(added_date)',
        'CREATE INDEX IF NOT EXISTS idx_image_groups_order ON image_groups(order_index)',
        'CREATE INDEX IF NOT EXISTS idx_image_groups_collection_type ON image_groups(collection_type)',
        'CREATE INDEX IF NOT EXISTS idx_image_groups_auto_date ON image_groups(auto_collected_date)'
    ];
    groupIndexes.forEach(sql => db.exec(sql));
    db.prepare(`INSERT OR IGNORE INTO groups (name, description, color) VALUES (?, ?, ?)`)
        .run('즐겨찾기', '즐겨찾는 이미지들', '#f59e0b');
    console.log('  ✅ 그룹 테이블 2개 + 인덱스 + 기본 그룹 생성 완료\n');
    console.log('⭐ 평가 시스템 테이블 생성 중...');
    db.exec(`
    CREATE TABLE IF NOT EXISTS rating_weights (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      general_weight REAL NOT NULL DEFAULT 1,
      sensitive_weight REAL NOT NULL DEFAULT 5,
      questionable_weight REAL NOT NULL DEFAULT 15,
      explicit_weight REAL NOT NULL DEFAULT 50,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
    db.exec(`
    CREATE TABLE IF NOT EXISTS rating_tiers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tier_name VARCHAR(50) NOT NULL,
      min_score REAL NOT NULL,
      max_score REAL,
      tier_order INTEGER NOT NULL,
      color VARCHAR(20),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(tier_order)
    )
  `);
    db.prepare(`
    INSERT OR IGNORE INTO rating_weights (id, general_weight, sensitive_weight, questionable_weight, explicit_weight)
    VALUES (1, 1, 5, 15, 50)
  `).run();
    const defaultTiers = [
        { tier_name: 'G', min_score: 0, max_score: 2, tier_order: 1, color: '#22c55e' },
        { tier_name: 'Teen', min_score: 2, max_score: 6, tier_order: 2, color: '#3b82f6' },
        { tier_name: 'SFW', min_score: 6, max_score: 15, tier_order: 3, color: '#f59e0b' },
        { tier_name: 'NSFW', min_score: 15, max_score: null, tier_order: 4, color: '#ef4444' }
    ];
    const insertTier = db.prepare(`
    INSERT OR IGNORE INTO rating_tiers (tier_name, min_score, max_score, tier_order, color)
    VALUES (?, ?, ?, ?, ?)
  `);
    defaultTiers.forEach(tier => {
        insertTier.run(tier.tier_name, tier.min_score, tier.max_score, tier.tier_order, tier.color);
    });
    console.log('  ✅ 평가 테이블 2개 + 기본 데이터 생성 완료\n');
    console.log('🖼️  미디어 메타데이터 테이블 생성 중...');
    db.exec(`
    CREATE TABLE IF NOT EXISTS media_metadata (
      composite_hash TEXT PRIMARY KEY,
      perceptual_hash TEXT,
      dhash TEXT,
      ahash TEXT,
      color_histogram TEXT,
      width INTEGER,
      height INTEGER,
      thumbnail_path TEXT,
      ai_tool TEXT,
      model_name TEXT,
      lora_models TEXT,
      steps INTEGER,
      cfg_scale REAL,
      sampler TEXT,
      seed INTEGER,
      scheduler TEXT,
      prompt TEXT,
      negative_prompt TEXT,
      denoise_strength REAL,
      generation_time REAL,
      batch_size INTEGER,
      batch_index INTEGER,
      auto_tags TEXT,
      duration REAL,
      fps REAL,
      video_codec TEXT,
      audio_codec TEXT,
      bitrate INTEGER,
      rating_score INTEGER DEFAULT 0,
      first_seen_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      metadata_updated_date DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
    const metadataIndexes = [
        'CREATE INDEX IF NOT EXISTS idx_metadata_phash ON media_metadata(perceptual_hash)',
        'CREATE INDEX IF NOT EXISTS idx_metadata_dhash ON media_metadata(dhash)',
        'CREATE INDEX IF NOT EXISTS idx_metadata_ahash ON media_metadata(ahash)',
        'CREATE INDEX IF NOT EXISTS idx_metadata_ai_tool ON media_metadata(ai_tool)',
        'CREATE INDEX IF NOT EXISTS idx_metadata_model ON media_metadata(model_name)',
        'CREATE INDEX IF NOT EXISTS idx_metadata_first_seen ON media_metadata(first_seen_date)',
        'CREATE INDEX IF NOT EXISTS idx_metadata_composite_lookup ON media_metadata(composite_hash, perceptual_hash, dhash, ahash)',
        'CREATE INDEX IF NOT EXISTS idx_metadata_first_seen_desc ON media_metadata(first_seen_date DESC)'
    ];
    metadataIndexes.forEach(sql => db.exec(sql));
    console.log('  ✅ 미디어 메타데이터 테이블 + 인덱스 생성 완료\n');
    console.log('📂 폴더 스캔 테이블 생성 중...');
    db.exec(`
    CREATE TABLE IF NOT EXISTS watched_folders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      folder_path TEXT NOT NULL UNIQUE,
      folder_name TEXT,
      auto_scan INTEGER DEFAULT 0,
      scan_interval INTEGER DEFAULT 60,
      recursive INTEGER DEFAULT 1,
      exclude_patterns TEXT,
      exclude_extensions TEXT,
      watcher_enabled INTEGER DEFAULT 0,
      watcher_status TEXT,
      watcher_error TEXT,
      watcher_last_event DATETIME,
      is_active INTEGER DEFAULT 1,
      is_default INTEGER DEFAULT 0,
      last_scan_date DATETIME,
      last_scan_status TEXT,
      last_scan_found INTEGER DEFAULT 0,
      last_scan_error TEXT,
      created_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_date DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
    db.exec(`
    CREATE TABLE IF NOT EXISTS image_files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      composite_hash TEXT,
      file_type TEXT NOT NULL DEFAULT 'image',
      original_file_path TEXT NOT NULL UNIQUE,
      folder_id INTEGER NOT NULL,
      file_status TEXT NOT NULL DEFAULT 'active',
      file_size INTEGER NOT NULL,
      mime_type TEXT NOT NULL,
      file_modified_date DATETIME,
      scan_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_verified_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (folder_id) REFERENCES watched_folders(id) ON DELETE CASCADE,
      FOREIGN KEY (composite_hash) REFERENCES media_metadata(composite_hash) ON DELETE SET NULL
    )
  `);
    db.exec(`
    CREATE TABLE IF NOT EXISTS scan_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      folder_id INTEGER NOT NULL,
      scan_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      scan_status TEXT NOT NULL,
      total_scanned INTEGER DEFAULT 0,
      new_images INTEGER DEFAULT 0,
      existing_images INTEGER DEFAULT 0,
      updated_paths INTEGER DEFAULT 0,
      missing_images INTEGER DEFAULT 0,
      errors_count INTEGER DEFAULT 0,
      duration_ms INTEGER,
      error_details TEXT,
      FOREIGN KEY (folder_id) REFERENCES watched_folders(id) ON DELETE CASCADE
    )
  `);
    const folderIndexes = [
        'CREATE INDEX IF NOT EXISTS idx_folders_active ON watched_folders(is_active)',
        'CREATE INDEX IF NOT EXISTS idx_folders_auto_scan ON watched_folders(auto_scan)',
        'CREATE INDEX IF NOT EXISTS idx_files_composite_hash ON image_files(composite_hash)',
        'CREATE INDEX IF NOT EXISTS idx_files_file_type ON image_files(file_type)',
        'CREATE INDEX IF NOT EXISTS idx_files_folder_id ON image_files(folder_id)',
        "CREATE INDEX IF NOT EXISTS idx_files_status ON image_files(file_status) WHERE file_status = 'active'",
        'CREATE INDEX IF NOT EXISTS idx_files_scan_date ON image_files(scan_date)',
        'CREATE INDEX IF NOT EXISTS idx_files_path ON image_files(original_file_path)',
        'CREATE INDEX IF NOT EXISTS idx_scan_logs_folder_id ON scan_logs(folder_id)',
        'CREATE INDEX IF NOT EXISTS idx_scan_logs_scan_date ON scan_logs(scan_date)',
        'CREATE INDEX IF NOT EXISTS idx_scan_logs_status ON scan_logs(scan_status)',
        'CREATE INDEX IF NOT EXISTS idx_files_folder_status ON image_files(folder_id, file_status)',
        'CREATE INDEX IF NOT EXISTS idx_files_hash_folder ON image_files(composite_hash, folder_id)',
        "CREATE INDEX IF NOT EXISTS idx_files_composite_status ON image_files(composite_hash, file_status) WHERE file_status = 'active'",
        'CREATE INDEX IF NOT EXISTS idx_files_scan_date_desc ON image_files(scan_date DESC)'
    ];
    folderIndexes.forEach(sql => db.exec(sql));
    const defaultUploadPath = process.env.RUNTIME_UPLOADS_DIR ||
        (process.env.RUNTIME_BASE_PATH
            ? path_1.default.join(process.env.RUNTIME_BASE_PATH, 'uploads')
            : path_1.default.join(process.cwd(), 'uploads'));
    db.prepare(`
    INSERT OR IGNORE INTO watched_folders
    (folder_path, folder_name, auto_scan, scan_interval, recursive, is_active, watcher_enabled, is_default)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(defaultUploadPath, 'Upload', 1, 60, 1, 1, 1, 0);
    console.log('  ✅ 폴더 테이블 3개 + 인덱스 + 기본 폴더 1개 생성 완료\n');
    console.log('⚙️  시스템 설정 테이블 생성 중...');
    db.exec(`
    CREATE TABLE IF NOT EXISTS system_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      description TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
    db.prepare(`
    INSERT OR IGNORE INTO system_settings (key, value, description)
    VALUES (?, ?, ?)
  `).run('phase2_interval', '5', 'Phase 2 백그라운드 해시 생성 간격 (분)');
    console.log('  ✅ 시스템 설정 테이블 + 기본값 생성 완료\n');
    console.log('🔍 파일 검증 로그 테이블 생성 중...');
    db.exec(`
    CREATE TABLE IF NOT EXISTS file_verification_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      verification_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      total_checked INTEGER DEFAULT 0,
      missing_found INTEGER DEFAULT 0,
      deleted_records INTEGER DEFAULT 0,
      duration_ms INTEGER,
      verification_type TEXT DEFAULT 'manual',
      error_count INTEGER DEFAULT 0,
      error_details TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
    db.exec(`
    CREATE INDEX IF NOT EXISTS idx_file_verification_logs_date
    ON file_verification_logs(verification_date DESC)
  `);
    console.log('  ✅ 파일 검증 로그 테이블 + 인덱스 생성 완료\n');
    console.log('🎉 통합 마이그레이션 완료!');
    console.log('📊 생성된 테이블 요약:');
    console.log('   - 프롬프트: 4개 테이블');
    console.log('   - 그룹: 2개 테이블');
    console.log('   - 평가: 2개 테이블');
    console.log('   - 미디어 메타데이터: 1개 테이블');
    console.log('   - 폴더 관리: 3개 테이블');
    console.log('   - 시스템 설정: 1개 테이블');
    console.log('   - 파일 검증 로그: 1개 테이블');
    console.log('   총 14개 테이블 + 인덱스 생성');
    console.log('   (워크플로우, 사용자 설정, API 생성 히스토리는 별도 DB)\n');
};
exports.up = up;
const down = async (db) => {
    console.log('🔄 통합 마이그레이션 롤백 시작...\n');
    const tables = [
        'file_verification_logs',
        'system_settings',
        'scan_logs',
        'image_files',
        'watched_folders',
        'image_groups',
        'groups',
        'rating_tiers',
        'rating_weights',
        'negative_prompt_groups',
        'prompt_groups',
        'negative_prompt_collection',
        'prompt_collection',
        'media_metadata'
    ];
    tables.forEach(table => {
        db.exec(`DROP TABLE IF EXISTS ${table}`);
        console.log(`  ✅ ${table} 테이블 제거`);
    });
    console.log('\n✅ 통합 마이그레이션 롤백 완료');
};
exports.down = down;
//# sourceMappingURL=000_create_all_tables.js.map