import { describe, expect, it } from 'vitest'
import { toPollInput } from './toPollInput'
import type { PollDetails } from '../api/pollsService'

function details(overrides: Partial<PollDetails> = {}): PollDetails {
  return {
    id: 1,
    title: 'כותרת',
    description: null,
    category: 'GENERAL',
    categoryLabel: 'כללי',
    status: 'APPROVED',
    rejectionReason: null,
    isOpen: true,
    voterCount: 0,
    hasVoted: false,
    closesAt: new Date(2030, 4, 7, 9, 5).toISOString(),
    myChoices: [],
    permissions: {
      canVote: true,
      canSeeResults: false,
      canEdit: true,
      canDelete: true,
      canClose: true,
    },
    questions: [
      {
        id: 10,
        text: 'שאלה',
        allowMultiple: true,
        position: 0,
        options: [
          { id: 100, text: 'כן', position: 0 },
          { id: 101, text: 'לא', position: 1 },
        ],
      },
    ],
    ...overrides,
  }
}

describe('toPollInput', () => {
  it('ממיר תיאור ריק (null) למחרוזת ריקה', () => {
    expect(toPollInput(details()).description).toBe('')
  })

  it('ממיר תאריך לפורמט של שדה datetime-local בשעון מקומי', () => {
    expect(toPollInput(details()).closesAt).toBe('2030-05-07T09:05')
  })

  it('משאיר רק את טקסט התשובות ואת allowMultiple', () => {
    expect(toPollInput(details()).questions).toEqual([
      { text: 'שאלה', allowMultiple: true, options: ['כן', 'לא'] },
    ])
  })
})
