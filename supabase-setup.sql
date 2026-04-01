-- 1. Кестені құру
CREATE TABLE IF NOT EXISTS student_answers (
  id BIGSERIAL PRIMARY KEY,
  student_name TEXT NOT NULL,
  answers JSONB NOT NULL,
  score INTEGER NOT NULL,
  grade INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. RLS өшіру
ALTER TABLE student_answers DISABLE ROW LEVEL SECURITY;

-- 3. Барлық құқықтарды беру (anon және authenticated пайдаланушыларға)
GRANT ALL ON student_answers TO anon;
GRANT ALL ON student_answers TO authenticated;
GRANT ALL ON student_answers TO service_role;

-- 4. Sequence-ке де құқық беру
GRANT USAGE, SELECT ON SEQUENCE student_answers_id_seq TO anon;
GRANT USAGE, SELECT ON SEQUENCE student_answers_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE student_answers_id_seq TO service_role;

-- 5. Тестілік деректер қосу (опционалды)
-- INSERT INTO student_answers (student_name, answers, score, grade) 
-- VALUES ('Тест студент', '{"1": "D", "2": "B"}', 2, 3);
