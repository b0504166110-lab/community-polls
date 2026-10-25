import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import VoteForm from './VoteForm'
import { renderWithProviders, regularUser } from '../test/render'
import { vote, type PollQuestion } from '../api/pollsService'

vi.mock('../api/pollsService')

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
    options: [
      { id: 21, text: 'קריאה', position: 0 },
      { id: 22, text: 'ריצה', position: 1 },
    ],
  },
]

function setup() {
  return renderWithProviders(<VoteForm pollId={5} questions={questions} />, {
    user: regularUser,
  })
}

describe('VoteForm', () => {
  beforeEach(() => {
    vi.stubGlobal('confirm', vi.fn(() => true))
    vi.mocked(vote).mockResolvedValue({} as never)
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('כפתור ההצבעה מושבת עד שעונים על כל השאלות', async () => {
    setup()
    const button = screen.getByRole('button', { name: 'הצבעה' })
    expect(button).toBeDisabled()
    await userEvent.click(screen.getByLabelText('אדום'))
    expect(button).toBeDisabled()
    await userEvent.click(screen.getByLabelText('קריאה'))
    expect(button).toBeEnabled()
  })

  it('בשאלה עם בחירה אחת, בחירה חדשה מחליפה את הקודמת', async () => {
    setup()
    await userEvent.click(screen.getByLabelText('אדום'))
    await userEvent.click(screen.getByLabelText('כחול'))
    expect(screen.getByLabelText('אדום')).not.toBeChecked()
    expect(screen.getByLabelText('כחול')).toBeChecked()
  })

  it('בשאלה עם בחירה מרובה אפשר לסמן ולבטל כמה תשובות', async () => {
    setup()
    await userEvent.click(screen.getByLabelText('קריאה'))
    await userEvent.click(screen.getByLabelText('ריצה'))
    expect(screen.getByLabelText('קריאה')).toBeChecked()
    expect(screen.getByLabelText('ריצה')).toBeChecked()
    await userEvent.click(screen.getByLabelText('קריאה'))
    expect(screen.getByLabelText('קריאה')).not.toBeChecked()
  })

  it('שליחה מאשרת, ושולחת את כל התשובות שנבחרו', async () => {
    setup()
    await userEvent.click(screen.getByLabelText('כחול'))
    await userEvent.click(screen.getByLabelText('קריאה'))
    await userEvent.click(screen.getByLabelText('ריצה'))
    await userEvent.click(screen.getByRole('button', { name: 'הצבעה' }))
    expect(confirm).toHaveBeenCalled()
    await waitFor(() => expect(vote).toHaveBeenCalledWith(5, [12, 21, 22]))
  })

  it('אם המשתמשת מבטלת באישור, לא נשלחת הצבעה', async () => {
    vi.stubGlobal('confirm', vi.fn(() => false))
    setup()
    await userEvent.click(screen.getByLabelText('אדום'))
    await userEvent.click(screen.getByLabelText('קריאה'))
    await userEvent.click(screen.getByRole('button', { name: 'הצבעה' }))
    expect(vote).not.toHaveBeenCalled()
  })

  it('הצבעה מוצלחת שומרת את הסקר המעודכן ב-cache', async () => {
    const updated = { id: 5, hasVoted: true }
    vi.mocked(vote).mockResolvedValue(updated as never)
    const { queryClient } = setup()
    await userEvent.click(screen.getByLabelText('אדום'))
    await userEvent.click(screen.getByLabelText('קריאה'))
    await userEvent.click(screen.getByRole('button', { name: 'הצבעה' }))
    await waitFor(() => expect(queryClient.getQueryData(['poll', 5])).toEqual(updated))
  })

  it('כשל בהצבעה מציג הודעת שגיאה', async () => {
    vi.mocked(vote).mockRejectedValue(new Error('boom'))
    setup()
    await userEvent.click(screen.getByLabelText('אדום'))
    await userEvent.click(screen.getByLabelText('קריאה'))
    await userEvent.click(screen.getByRole('button', { name: 'הצבעה' }))
    expect(await screen.findByText('משהו השתבש')).toBeInTheDocument()
  })
})
