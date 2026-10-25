import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import PollQuestions from './PollQuestions'
import type { PollQuestion } from '../api/pollsService'

const questions: PollQuestion[] = [
  {
    id: 1,
    text: 'צבע אהוב',
    allowMultiple: false,
    position: 0,
    options: [
      { id: 11, text: 'אדום', position: 0 },
      { id: 12, text: 'כחול', position: 1 },
    ],
  },
  {
    id: 2,
    text: 'תחביבים',
    allowMultiple: true,
    position: 1,
    options: [{ id: 21, text: 'קריאה', position: 0 }],
  },
]

describe('PollQuestions', () => {
  it('מציג כל שאלה עם התשובות שלה', () => {
    render(<PollQuestions questions={questions} />)
    expect(screen.getByText('צבע אהוב')).toBeInTheDocument()
    expect(screen.getByText('אדום')).toBeInTheDocument()
    expect(screen.getByText('כחול')).toBeInTheDocument()
    expect(screen.getByText('קריאה')).toBeInTheDocument()
  })

  it('לא מציג שדות בחירה', () => {
    render(<PollQuestions questions={questions} />)
    expect(screen.queryByRole('radio')).not.toBeInTheDocument()
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('שאלה עם בחירה מרובה מסומנת בהסבר', () => {
    render(<PollQuestions questions={questions} />)
    expect(screen.getByText(/אפשר לבחור כמה תשובות/)).toBeInTheDocument()
  })
})
