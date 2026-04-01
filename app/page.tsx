'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { questions, answers, calculateGrade } from '@/lib/questions'

export default function Home() {
  const router = useRouter()
  const [studentName, setStudentName] = useState('')
  const [studentAnswers, setStudentAnswers] = useState<Record<number, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [grade, setGrade] = useState(0)
  const [loading, setLoading] = useState(false)
  const [draggedAnswer, setDraggedAnswer] = useState<string | null>(null)

  const handleAnswerChange = (questionId: number, answer: string) => {
    setStudentAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const handleDragStart = (answerId: string) => {
    setDraggedAnswer(answerId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (questionId: number) => {
    if (draggedAnswer) {
      handleAnswerChange(questionId, draggedAnswer)
      setDraggedAnswer(null)
    }
  }

  const handleRemoveAnswer = (questionId: number) => {
    const newAnswers = { ...studentAnswers }
    delete newAnswers[questionId]
    setStudentAnswers(newAnswers)
  }

  const handleSubmit = async () => {
    if (!studentName.trim()) {
      alert('Аты-жөніңізді енгізіңіз!')
      return
    }

    if (Object.keys(studentAnswers).length !== questions.length) {
      alert('Барлық сұрақтарға жауап беріңіз!')
      return
    }

    setLoading(true)

    // Дұрыс жауаптарды санау
    let correctCount = 0
    questions.forEach(q => {
      if (studentAnswers[q.id] === q.correctAnswer) {
        correctCount++
      }
    })

    const finalGrade = calculateGrade(correctCount, questions.length)

    // Supabase-ке сақтау
    if (supabase) {
      const { error } = await supabase
        .from('student_answers')
        .insert({
          student_name: studentName,
          answers: studentAnswers,
          score: correctCount,
          grade: finalGrade
        })

      if (error) {
        console.error('Қате:', error)
        alert('Деректерді сақтау кезінде қате орын алды!')
        setLoading(false)
        return
      }
    } else {
      // Supabase жоқ болса, localStorage-ке сақтау
      const existingData = localStorage.getItem('studentResults')
      const results = existingData ? JSON.parse(existingData) : []
      results.push({
        id: Date.now(),
        student_name: studentName,
        answers: studentAnswers,
        score: correctCount,
        grade: finalGrade,
        created_at: new Date().toISOString()
      })
      localStorage.setItem('studentResults', JSON.stringify(results))
    }

    setScore(correctCount)
    setGrade(finalGrade)
    setSubmitted(true)
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="container">
        <div className="success-message">
          <svg className="success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <h2>Тест сәтті аяқталды!</h2>
          <p style={{ fontSize: '1.2rem', marginTop: '16px' }}>
            <strong>{studentName}</strong>, сіздің нәтижеңіз:
          </p>
          <p style={{ fontSize: '2rem', margin: '20px 0', fontWeight: 'bold' }}>
            {score} / {questions.length} дұрыс жауап
          </p>
          <p style={{ fontSize: '1.5rem' }}>
            Баға: <span className={`grade-badge grade-${grade}`}>{grade}</span>
          </p>
        </div>
        <div className="nav-links">
          <a href="/">← Басты бетке оралу</a>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="header">
        <h1>
          <svg className="header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg>
          Сәйкестендіру тесті
        </h1>
        <p>Ақпараттық қауіпсіздік бойынша</p>
      </div>

      <div className="input-group">
        <label htmlFor="studentName">Аты-жөніңіз:</label>
        <input
          id="studentName"
          type="text"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          placeholder="Мысалы: Айдос Нұрланұлы"
        />
      </div>

      <div className="matching-container">
        <div className="questions-column">
          <h3>Ұғымдар</h3>
          {questions.map((question) => (
            <div
              key={question.id}
              className="question-card"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(question.id)}
            >
              <div className="question-term">{question.term}</div>
              <div className="drop-zone">
                {studentAnswers[question.id] ? (
                  <div className="dropped-answer">
                    <span>
                      {studentAnswers[question.id]}) {answers.find(a => a.id === studentAnswers[question.id])?.text}
                    </span>
                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveAnswer(question.id)}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="empty-drop">
                    Жауапты осы жерге жылжытыңыз
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="answers-column">
          <h3>Сипаттамалар</h3>
          {answers.map((answer) => {
            const isUsed = Object.values(studentAnswers).includes(answer.id)
            return (
              <div
                key={answer.id}
                className={`answer-card ${isUsed ? 'used' : ''}`}
                draggable={!isUsed}
                onDragStart={() => handleDragStart(answer.id)}
              >
                <span className="answer-id">{answer.id})</span>
                <span className="answer-text">{answer.text}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
            <polyline points="17 21 17 13 7 13 7 21"></polyline>
            <polyline points="7 3 7 8 15 8"></polyline>
          </svg>
          {loading ? 'Сақталуда...' : 'Жауаптарды сақтау'}
        </button>
      </div>
    </div>
  )
}
