# 🚀 Серверге жүктеу нұсқаулары

## 1️⃣ Supabase дайындау

### SQL кодын орындау:
Supabase Dashboard → SQL Editor-да төмендегі кодты орындаңыз:

```sql
CREATE TABLE student_answers (
  id BIGSERIAL PRIMARY KEY,
  student_name TEXT NOT NULL,
  answers JSONB NOT NULL,
  score INTEGER NOT NULL,
  grade INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS өшіру (барлығына қол жетімді болу үшін)
ALTER TABLE student_answers DISABLE ROW LEVEL SECURITY;
```

### API деректерін алу:
1. Supabase Dashboard → Settings →
2. Көшіріңіз:
   - `Project URL` → NEXT_PUBLIC_SUPABASE_URL
   - `anon public` key → NEXT_PUBLIC_SUPABASE_ANON_KEY

---

## 2️⃣ Vercel-ге жүктеу (ҰСЫНЫЛАДЫ)

### Vercel - тегін, жылдам, оңай:

1. **GitHub-қа жүктеу:**
```bash
git init
git add .
git commit -m "Сәйкестендіру тесті"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

2. **Vercel-ге қосу:**
   - [vercel.com](https://vercel.com) → Sign up with GitHub
   - "New Project" → GitHub репозиторийді таңдау
   - Environment Variables қосу:
     ```
     NEXT_PUBLIC_SUPABASE_URL = your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY = your_supabase_key
     ```
   - "Deploy" басу

3. **Дайын!** 
   - URL: `https://your-project.vercel.app`
   - Оқытушы беті: `https://your-project.vercel.app/teacher`

---

## 3️⃣ Netlify-ға жүктеу

1. **Build дайындау:**
```bash
npm run build
```

2. **Netlify-ға жүктеу:**
   - [netlify.com](https://netlify.com) → New site from Git
   - GitHub репозиторийді қосу
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`
   - Environment variables қосу (Supabase деректері)
   - Deploy

---

## 4️⃣ VPS серверге жүктеу (Ubuntu/Linux)

### Сервердегі орнату:

```bash
# Node.js орнату
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# PM2 орнату (процесс менеджері)
sudo npm install -g pm2

# Жобаны серверге көшіру
scp -r ./* user@your-server:/var/www/your-project/

# Серверде:
cd /var/www/your-project
npm install
npm run build

# .env.local файлын құру
nano .env.local
# Supabase деректерін қосу

# PM2-мен іске қосу
pm2 start npm --name "matching-test" -- start
pm2 save
pm2 startup
```

### Nginx конфигурациясы:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo systemctl restart nginx
```

---

## 5️⃣ Тексеру тізімі

Серверге жүктеу алдында:

- [ ] `.env.local` файлында Supabase деректері бар
- [ ] Supabase-те `student_answers` кестесі құрылған
- [ ] `npm run build` қатесіз жұмыс істейді
- [ ] Локальда барлығы дұрыс жұмыс істейді
- [ ] `.gitignore` файлында `.env.local` бар (құпия деректер GitHub-қа кетпеу үшін)

---

## 🎯 Ең жақсы нұсқа: Vercel

Неліктен Vercel:
- ✅ Тегін
- ✅ Автоматты deploy (GitHub-қа push жасасаңыз)
- ✅ HTTPS автоматты
- ✅ Жылдам CDN
- ✅ Next.js үшін оңтайландырылған
- ✅ Орнату оңай

---

## 📞 Көмек

Егер қиындық туындаса:
1. Supabase деректері дұрыс па тексеріңіз
2. Browser Console-де қателерді қараңыз (F12)
3. Vercel/Netlify логтарын тексеріңіз
