import { describe, expect, it } from 'vitest'
import { validatePoll } from './validatePoll'
import type { PollInput } from '../api/pollsService'

const DAY = 24 * 60 * 60 * 1000

function validPoll(overrides: Partial<PollInput> = {}): PollInput {
  return {
    title: 'כותרת תקינה',
    description: 'תיאור',
    category: 'GENERAL',
    closesAt: new Date(Date.now() + 7 * DAY).toISOString(),
    questions: [{ text: 'שאלה ראשונה', options: ['כן', 'לא'] }],
    ...overrides,
  }
}

describe('validatePoll', () => {
  it('סקר תקין לא מחזיר שגיאות', () => {
    expect(validatePoll(validPoll())).toEqual({})
  })

  it('כותרת קצרה מדי או ארוכה מדי', () => {
    expect(validatePoll(validPoll({ title: 'abcd' })).title).toBeDefined()
    expect(validatePoll(validPoll({ title: 'a'.repeat(5) })).title).toBeUndefined()
    expect(validatePoll(validPoll({ title: 'a'.repeat(151) })).title).toBeDefined()
  })

  it('תיאור ארוך מ-500 תווים', () => {
    expect(validatePoll(validPoll({ description: 'a'.repeat(501) })).description).toBeDefined()
    expect(validatePoll(validPoll({ description: null })).description).toBeUndefined()
  })

  it('חובה לבחור קטגוריה', () => {
    expect(validatePoll(validPoll({ category: '' })).category).toBeDefined()
  })

  it('תאריך סגירה: חסר, בעבר, ורחוק מדי', () => {
    expect(validatePoll(validPoll({ closesAt: '' })).closesAt).toBeDefined()
    expect(
      validatePoll(validPoll({ closesAt: new Date(Date.now() - DAY).toISOString() })).closesAt,
    ).toBeDefined()
    expect(
      validatePoll(validPoll({ closesAt: new Date(Date.now() + 400 * DAY).toISOString() })).closesAt,
    ).toBeDefined()
  })

  it('טקסט שאלה קצר או ארוך מדי', () => {
    const short = validatePoll(validPoll({ questions: [{ text: 'א', options: ['כן', 'לא'] }] }))
    expect(short['questions.0.text']).toBeDefined()
    const long = validatePoll(
      validPoll({ questions: [{ text: 'א'.repeat(151), options: ['כן', 'לא'] }] }),
    )
    expect(long['questions.0.text']).toBeDefined()
  })

  it('תשובה ריקה או ארוכה מדי מסומנת לפי המיקום שלה', () => {
    const errors = validatePoll(
      validPoll({ questions: [{ text: 'שאלה', options: ['כן', '', 'א'.repeat(101)] }] }),
    )
    expect(errors['questions.0.options.1']).toBeDefined()
    expect(errors['questions.0.options.2']).toBeDefined()
    expect(errors['questions.0.options.0']).toBeUndefined()
  })

  it('תשובות זהות נחשבות שגיאה, בלי הבדל בין אותיות גדולות לקטנות', () => {
    const errors = validatePoll(
      validPoll({ questions: [{ text: 'שאלה', options: ['Yes', 'yes'] }] }),
    )
    expect(errors['questions.0.options']).toBeDefined()
  })

  it('שגיאה בשאלה השנייה מסומנת באינדקס הנכון', () => {
    const errors = validatePoll(
      validPoll({
        questions: [
          { text: 'שאלה ראשונה', options: ['כן', 'לא'] },
          { text: 'ב', options: ['כן', 'לא'] },
        ],
      }),
    )
    expect(errors['questions.1.text']).toBeDefined()
    expect(errors['questions.0.text']).toBeUndefined()
  })
})
