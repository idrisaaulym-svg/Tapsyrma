export const questions = [
  {
    id: 1,
    term: 'Ақпараттық қауіпсіздік',
    correctAnswer: 'D'
  },
  {
    id: 2,
    term: 'Вирус',
    correctAnswer: 'B'
  },
  {
    id: 3,
    term: 'Антивирус',
    correctAnswer: 'A'
  },
  {
    id: 4,
    term: 'Хакер',
    correctAnswer: 'F'
  },
  {
    id: 5,
    term: 'Пароль',
    correctAnswer: 'C'
  },
  {
    id: 6,
    term: 'Фишинг',
    correctAnswer: 'E'
  }
]

export const answers = [
  { id: 'A', text: 'Компьютерді зиянды бағдарламалардан қорғайтын бағдарлама' },
  { id: 'B', text: 'Жүйеге зиян келтіретін бағдарлама' },
  { id: 'C', text: 'Жеке мәліметтерді қорғауға арналған құпия сөз' },
  { id: 'D', text: 'Ақпаратты қорғау және сақтау жүйесі' },
  { id: 'E', text: 'Алаяқтық арқылы мәліметтерді ұрлау тәсілі' },
  { id: 'F', text: 'Жүйеге рұқсатсыз кіретін адам' }
]

export function calculateGrade(score: number, total: number): number {
  if (score >= 5) return 5
  if (score >= 4) return 4
  return 3
}
