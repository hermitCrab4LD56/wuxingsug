-- 创建用户表
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(50) NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female')),
    birth_date DATE NOT NULL,
    birth_time TIME NOT NULL,
    plan VARCHAR(20) DEFAULT 'free' CHECK (plan IN ('free', 'vip')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建用户表索引
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- 创建八字表
CREATE TABLE user_bazi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    year_pillar VARCHAR(10) NOT NULL,
    month_pillar VARCHAR(10) NOT NULL,
    day_pillar VARCHAR(10) NOT NULL,
    hour_pillar VARCHAR(10) NOT NULL,
    wuxing_analysis JSONB,
    analysis_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建八字表索引
CREATE INDEX idx_user_bazi_user_id ON user_bazi(user_id);

-- 创建每日建议表
CREATE TABLE daily_advice (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    advice_date DATE NOT NULL,
    clothing_colors JSONB,
    avoid_colors JSONB,
    travel_direction VARCHAR(20),
    lucky_times JSONB,
    suggestions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建每日建议表索引
CREATE INDEX idx_daily_advice_user_id ON daily_advice(user_id);
CREATE INDEX idx_daily_advice_date ON daily_advice(advice_date DESC);
CREATE UNIQUE INDEX idx_daily_advice_user_date ON daily_advice(user_id, advice_date);

-- 创建反馈表
CREATE TABLE advice_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    advice_id UUID REFERENCES daily_advice(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建反馈表索引
CREATE INDEX idx_advice_feedback_user_id ON advice_feedback(user_id);
CREATE INDEX idx_advice_feedback_advice_id ON advice_feedback(advice_id);
CREATE INDEX idx_advice_feedback_rating ON advice_feedback(rating DESC);

-- 启用行级安全策略
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_bazi ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_advice ENABLE ROW LEVEL SECURITY;
ALTER TABLE advice_feedback ENABLE ROW LEVEL SECURITY;

-- 创建RLS策略
-- 用户表策略：用户只能访问自己的数据
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- 八字表策略：用户只能访问自己的八字数据
CREATE POLICY "Users can view own bazi" ON user_bazi
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own bazi" ON user_bazi
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own bazi" ON user_bazi
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- 每日建议表策略：用户只能访问自己的建议
CREATE POLICY "Users can view own advice" ON daily_advice
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own advice" ON daily_advice
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- 反馈表策略：用户只能访问自己的反馈
CREATE POLICY "Users can view own feedback" ON advice_feedback
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own feedback" ON advice_feedback
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- 权限设置
GRANT SELECT ON users TO anon;
GRANT ALL PRIVILEGES ON users TO authenticated;

GRANT SELECT ON user_bazi TO anon;
GRANT ALL PRIVILEGES ON user_bazi TO authenticated;

GRANT SELECT ON daily_advice TO anon;
GRANT ALL PRIVILEGES ON daily_advice TO authenticated;

GRANT SELECT ON advice_feedback TO anon;
GRANT ALL PRIVILEGES ON advice_feedback TO authenticated;

-- 插入测试数据
INSERT INTO users (id, phone, password_hash, name, gender, birth_date, birth_time, plan)
VALUES 
('550e8400-e29b-41d4-a716-446655440000', '13800138000', '$2b$10$example_hash', '张三', 'male', '1990-05-15', '08:30:00', 'free'),
('550e8400-e29b-41d4-a716-446655440001', '13900139000', '$2b$10$example_hash', '李四', 'female', '1985-10-20', '14:20:00', 'vip');

-- 插入测试八字数据
INSERT INTO user_bazi (user_id, year_pillar, month_pillar, day_pillar, hour_pillar, wuxing_analysis, analysis_text)
VALUES 
('550e8400-e29b-41d4-a716-446655440000', '庚午', '辛巳', '甲子', '戊辰', '{"wood": 2, "fire": 3, "earth": 2, "metal": 2, "water": 1}', '五行火旺，木为用神，宜穿绿色、青色服装'),
('550e8400-e29b-41d4-a716-446655440001', '乙丑', '戊戌', '丁酉', '壬申', '{"wood": 1, "fire": 1, "earth": 3, "metal": 3, "water": 2}', '五行土金旺，火为用神，宜穿红色、橙色服装');