import { beforeEach, describe, expect, it, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AdminPollActions from './AdminPollActions'
import { renderWithProviders } from '../test/render'
import { approvePoll, rejectPoll, setPollHidden } from '../api/adminService'
import { deletePoll } from '../api/pollsService'

vi.mock('../api/adminService')
vi.mock('../api/pollsService')

describe('AdminPollActions', () => {
  beforeEach(() => {
    vi.mocked(deletePoll).mockResolvedValue(undefined)
    vi.mocked(approvePoll).mockResolvedValue({} as never)
    vi.mocked(rejectPoll).mockResolvedValue({} as never)
    vi.mocked(setPollHidden).mockResolvedValue({} as never)
  })

  it('סקר ממתין: אישור קורא ל-API ומרענן את הרשימות', async () => {
    const { invalidate } = renderWithProviders(
      <AdminPollActions pollId={7} status="PENDING" isHidden={false} />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'אישור' }))
    await waitFor(() => expect(approvePoll).toHaveBeenCalledWith(7))
    await waitFor(() => expect(invalidate).toHaveBeenCalledWith({ queryKey: ['admin-polls'] }))
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ['polls'] })
  })

  it('דחייה עם סיבה שולחת את הסיבה בלי רווחים מיותרים', async () => {
    renderWithProviders(<AdminPollActions pollId={7} status="PENDING" isHidden={false} />)
    await userEvent.type(screen.getByPlaceholderText('סיבת הדחייה (חובה)'), '  לא מתאים  ')
    await userEvent.click(screen.getByRole('button', { name: 'דחייה' }))
    await waitFor(() => expect(rejectPoll).toHaveBeenCalledWith(7, 'לא מתאים'))
  })

  it('בלי סיבה כפתור הדחייה מושבת', async () => {
    renderWithProviders(<AdminPollActions pollId={7} status="PENDING" isHidden={false} />)
    const button = screen.getByRole('button', { name: 'דחייה' })
    expect(button).toBeDisabled()
    await userEvent.type(screen.getByPlaceholderText('סיבת הדחייה (חובה)'), '   ')
    expect(button).toBeDisabled()
    expect(rejectPoll).not.toHaveBeenCalled()
  })

  it('אחרי דחייה תקינה שדה הסיבה מתנקה', async () => {
    renderWithProviders(<AdminPollActions pollId={7} status="PENDING" isHidden={false} />)
    const input = screen.getByPlaceholderText('סיבת הדחייה (חובה)')
    await userEvent.type(input, 'סיבה')
    await userEvent.click(screen.getByRole('button', { name: 'דחייה' }))
    await waitFor(() => expect(input).toHaveValue(''))
  })

  it('סקר מאושר גלוי: כפתור הסתרה שולח isHidden=true', async () => {
    renderWithProviders(<AdminPollActions pollId={7} status="APPROVED" isHidden={false} />)
    expect(screen.queryByRole('button', { name: 'אישור' })).not.toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'הסתרה' }))
    await waitFor(() => expect(setPollHidden).toHaveBeenCalledWith(7, true))
  })

  it('סקר מוסתר: כפתור החזרה לתצוגה שולח isHidden=false', async () => {
    renderWithProviders(<AdminPollActions pollId={7} status="APPROVED" isHidden />)
    await userEvent.click(screen.getByRole('button', { name: 'החזרה לתצוגה' }))
    await waitFor(() => expect(setPollHidden).toHaveBeenCalledWith(7, false))
  })

  it('סקר שנדחה: אפשר לאשר אותו, אבל לא לדחות שוב', () => {
    renderWithProviders(<AdminPollActions pollId={7} status="REJECTED" isHidden={false} />)
    expect(screen.getByRole('button', { name: 'אישור' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'דחייה' })).not.toBeInTheDocument()
  })

  it('סקר מאושר: אפשר לדחות אותו עם סיבה', async () => {
    renderWithProviders(<AdminPollActions pollId={7} status="APPROVED" isHidden={false} />)
    await userEvent.type(screen.getByPlaceholderText('סיבת הדחייה (חובה)'), 'נמצאה בעיה')
    await userEvent.click(screen.getByRole('button', { name: 'דחייה' }))
    await waitFor(() => expect(rejectPoll).toHaveBeenCalledWith(7, 'נמצאה בעיה'))
  })

  it('מחיקה מבקשת אישור וקוראת ל-API', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const { invalidate } = renderWithProviders(
      <AdminPollActions pollId={7} status="APPROVED" isHidden={false} />,
    )
    await userEvent.click(screen.getByRole('button', { name: 'מחיקה' }))
    await waitFor(() => expect(deletePoll).toHaveBeenCalledWith(7))
    await waitFor(() => expect(invalidate).toHaveBeenCalledWith({ queryKey: ['admin-polls'] }))
  })

  it('ביטול באישור המחיקה לא קורא ל-API', async () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false)
    renderWithProviders(<AdminPollActions pollId={7} status="APPROVED" isHidden={false} />)
    await userEvent.click(screen.getByRole('button', { name: 'מחיקה' }))
    expect(deletePoll).not.toHaveBeenCalled()
  })

  it('כשל באישור מציג הודעת שגיאה', async () => {
    vi.mocked(approvePoll).mockRejectedValue(new Error('boom'))
    renderWithProviders(<AdminPollActions pollId={7} status="PENDING" isHidden={false} />)
    await userEvent.click(screen.getByRole('button', { name: 'אישור' }))
    expect(await screen.findByText('משהו השתבש')).toBeInTheDocument()
  })
})
