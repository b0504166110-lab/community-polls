import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Pagination from './Pagination'

describe('Pagination', () => {
  it('בעמוד הראשון הכפתור הקודם מושבת', () => {
    render(<Pagination page={1} totalPages={3} onPageChange={() => {}} />)
    expect(screen.getByRole('button', { name: 'הקודם' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'הבא' })).toBeEnabled()
  })

  it('בעמוד האחרון הכפתור הבא מושבת', () => {
    render(<Pagination page={3} totalPages={3} onPageChange={() => {}} />)
    expect(screen.getByRole('button', { name: 'הבא' })).toBeDisabled()
  })

  it('לחיצה קוראת עם מספר העמוד החדש', async () => {
    const onPageChange = vi.fn()
    render(<Pagination page={2} totalPages={3} onPageChange={onPageChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'הבא' }))
    await userEvent.click(screen.getByRole('button', { name: 'הקודם' }))
    expect(onPageChange).toHaveBeenNthCalledWith(1, 3)
    expect(onPageChange).toHaveBeenNthCalledWith(2, 1)
  })
})
