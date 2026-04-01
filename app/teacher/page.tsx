'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { StudentAnswer } from '@/lib/supabase'

export default function TeacherPage() {
  const router = useRouter()
  const [results, setResults] = useState<StudentAnswer[]>([])
  const [filteredResults, setFilteredResults] = useState<StudentAnswer[]>([])
  const [gradeFilter, setGradeFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchResults()
  }, [])

  useEffect(() => {
    if (gradeFilter === 'all') {
      setFilteredResults(results)
    } else {
      const grade = parseInt(gradeFilter)
      setFilteredResults(results.filter(r => r.grade === grade))
    }
  }, [gradeFilter, results])

  const fetchResults = async () => {
    setLoading(true)
    
    if (supabase) {
      // Supabase-тен алу
      const { data, error } = await supabase
        .from('student_answers')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Қате:', error)
      } else {
        setResults(data || [])
        setFilteredResults(data || [])
      }
    } else {
      // localStorage-тен алу
      const existingData = localStorage.getItem('studentResults')
      const data = existingData ? JSON.parse(existingData) : []
      setResults(data)
      setFilteredResults(data)
    }
    
    setLoading(false)
  }

  const handleClearAll = async () => {
    const confirmed = confirm('Барлық жауаптарды өшіргіңіз келе ме? Бұл әрекетті қайтару мүмкін емес!')
    
    if (!confirmed) return

    setLoading(true)

    if (supabase) {
      // Supabase-тен өшіру
      const { error } = await supabase
        .from('student_answers')
        .delete()
        .neq('id', 0) // Барлық жазбаларды өшіру

      if (error) {
        console.error('Қате:', error)
        alert('Деректерді өшіру кезінде қате орын алды!')
      } else {
        alert('Барлық жауаптар сәтті өшірілді!')
        setResults([])
        setFilteredResults([])
      }
    } else {
      // localStorage-тен өшіру
      localStorage.removeItem('studentResults')
      alert('Барлық жауаптар сәтті өшірілді!')
      setResults([])
      setFilteredResults([])
    }

    setLoading(false)
  }

  const stats = {
    total: results.length,
    grade5: results.filter(r => r.grade === 5).length,
    grade4: results.filter(r => r.grade === 4).length,
    grade3: results.filter(r => r.grade === 3).length,
  }

  return (
    <div className="container">
      <div className="header">
        <h1>
          <svg className="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          Оқытушы панелі
        </h1>
        <p>Студенттердің нәтижелері</p>
      </div>

      <div className="stats">
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <h3>{stats.total}</h3>
          <p>Барлығы студент</p>
        </div>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)' }}>
          <h3>{stats.grade5}</h3>
          <p>Баға: 5</p>
        </div>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)' }}>
          <h3>{stats.grade4}</h3>
          <p>Баға: 4</p>
        </div>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #ffc107 0%, #ff9800 100%)' }}>
          <h3>{stats.grade3}</h3>
          <p>Баға: 3</p>
        </div>
      </div>

      <div className="filter-section">
        <label>Бағалар бойынша фильтр:</label>
        <select value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)}>
          <option value="all">Барлығы</option>
          <option value="5">Баға: 5</option>
          <option value="4">Баға: 4</option>
          <option value="3">Баға: 3</option>
        </select>
        
        <button 
          className="btn btn-danger"
          onClick={handleClearAll}
          disabled={loading || results.length === 0}
        >
          <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
          Барлығын тазалау
        </button>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', fontSize: '1.2rem' }}>Жүктелуде...</p>
      ) : filteredResults.length === 0 ? (
        <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#7f8c8d' }}>
          Әзірге нәтижелер жоқ
        </p>
      ) : (
        <table className="results-table">
          <thead>
            <tr>
              <th>№</th>
              <th>Студент аты-жөні</th>
              <th>Дұрыс жауаптар</th>
              <th>Қате жауаптар</th>
              <th>Баға</th>
              <th>Күні</th>
            </tr>
          </thead>
          <tbody>
            {filteredResults.map((result, index) => (
              <tr key={result.id}>
                <td>{index + 1}</td>
                <td>{result.student_name}</td>
                <td style={{ color: '#28a745', fontWeight: 'bold' }}>{result.score}</td>
                <td style={{ color: '#dc3545', fontWeight: 'bold' }}>{6 - result.score}</td>
                <td>
                  <span className={`grade-badge grade-${result.grade}`}>
                    {result.grade}
                  </span>
                </td>
                <td>{new Date(result.created_at!).toLocaleString('kk-KZ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="nav-links">
        <a href="/">← Студент бетіне оралу</a>
      </div>
    </div>
  )
}
