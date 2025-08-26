import {  act, renderHook } from '@testing-library/react'
import { useDebounce } from '../src/hooks/useDebounce'
import { vi, test, expect } from 'vitest'

vi.useFakeTimers()

test('debounces value changes', () => {
  const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), { initialProps: { value: 'a' } })
  expect(result.current).toBe('a')
  rerender({ value: 'ab' })
  expect(result.current).toBe('a')
  act(() => { vi.advanceTimersByTime(299) })
  expect(result.current).toBe('a')
  act(() => { vi.advanceTimersByTime(1) })
  expect(result.current).toBe('ab')
})
// Remove this function. The `expect` function is already provided by the testing framework (Vitest).
// No need to implement it yourself.

