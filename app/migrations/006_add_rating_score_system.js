"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const up = async (db) => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run(`
        CREATE TABLE IF NOT EXISTS rating_weights (
          id INTEGER PRIMARY KEY CHECK (id = 1),
          general_weight REAL NOT NULL DEFAULT 1,
          sensitive_weight REAL NOT NULL DEFAULT 5,
          questionable_weight REAL NOT NULL DEFAULT 15,
          explicit_weight REAL NOT NULL DEFAULT 50,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
        `, (err) => {
                if (err) {
                    console.error('Error creating rating_weights table:', err);
                    reject(err);
                    return;
                }
                console.log('✅ rating_weights 테이블 생성 완료');
            });
            db.run(`
        INSERT INTO rating_weights (id, general_weight, sensitive_weight, questionable_weight, explicit_weight)
        VALUES (1, 1, 5, 15, 50)
        `, (err) => {
                if (err) {
                    console.error('Error inserting default rating weights:', err);
                    reject(err);
                    return;
                }
                console.log('✅ rating_weights 기본값 삽입 완료');
            });
            db.run(`
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
        `, (err) => {
                if (err) {
                    console.error('Error creating rating_tiers table:', err);
                    reject(err);
                    return;
                }
                console.log('✅ rating_tiers 테이블 생성 완료');
            });
            const defaultTiers = [
                { tier_name: 'G', min_score: 0, max_score: 2, tier_order: 1, color: '#22c55e' },
                { tier_name: 'Teen', min_score: 2, max_score: 6, tier_order: 2, color: '#3b82f6' },
                { tier_name: 'SFW', min_score: 6, max_score: 15, tier_order: 3, color: '#f59e0b' },
                { tier_name: 'NSFW', min_score: 15, max_score: null, tier_order: 4, color: '#ef4444' }
            ];
            let insertedCount = 0;
            defaultTiers.forEach((tier) => {
                db.run(`
          INSERT INTO rating_tiers (tier_name, min_score, max_score, tier_order, color)
          VALUES (?, ?, ?, ?, ?)
          `, [tier.tier_name, tier.min_score, tier.max_score, tier.tier_order, tier.color], (err) => {
                    if (err) {
                        console.error(`Error inserting tier ${tier.tier_name}:`, err);
                        reject(err);
                        return;
                    }
                    insertedCount++;
                    if (insertedCount === defaultTiers.length) {
                        console.log(`✅ rating_tiers 기본값 ${insertedCount}개 삽입 완료`);
                        console.log('✅ Migration 006: Rating 점수 시스템 추가 완료');
                        resolve();
                    }
                });
            });
        });
    });
};
exports.up = up;
const down = async (db) => {
    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run('DROP TABLE IF EXISTS rating_tiers', (err) => {
                if (err) {
                    console.error('Error dropping rating_tiers table:', err);
                    reject(err);
                    return;
                }
                console.log('✅ rating_tiers 테이블 삭제');
            });
            db.run('DROP TABLE IF EXISTS rating_weights', (err) => {
                if (err) {
                    console.error('Error dropping rating_weights table:', err);
                    reject(err);
                    return;
                }
                console.log('✅ rating_weights 테이블 삭제');
                console.log('✅ Migration 006 rollback: Rating 점수 시스템 제거 완료');
                resolve();
            });
        });
    });
};
exports.down = down;
//# sourceMappingURL=006_add_rating_score_system.js.map