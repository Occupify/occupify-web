import test from 'node:test'
import assert from 'node:assert/strict'
import {
  SAVED_PROJECT_IDS_KEY,
  readSavedIds,
  saveSavedIds,
  getSavedJobIds,
  toggleSaveJob,
  getSavedJobs,
  setCustomJobResolver,
} from './get-saved-jobs.ts'

// In-memory Mock Storage implementation for Node.js test environment
class MemoryStorage implements Storage {
  private store = new Map<string, string>()

  get length(): number {
    return this.store.size
  }

  clear(): void {
    this.store.clear()
  }

  getItem(key: string): string | null {
    return this.store.get(key) ?? null
  }

  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null
  }

  removeItem(key: string): void {
    this.store.delete(key)
  }

  setItem(key: string, value: string): void {
    this.store.set(key, String(value))
  }
}

const mockStorage = new MemoryStorage()
globalThis.localStorage = mockStorage

test.beforeEach(() => {
  mockStorage.clear()
  setCustomJobResolver(null)
})

// ─────────────────────────────────────────────────────────────────────────────
// T-1 (Default State)
// ─────────────────────────────────────────────────────────────────────────────

test('T-1: getSavedJobIds() returns [] when localStorage is empty', async () => {
  const ids = await getSavedJobIds()
  assert.deepEqual(ids, [])
})

test('T-1: readSavedIds() returns [] when localStorage key does not exist', () => {
  assert.equal(mockStorage.getItem(SAVED_PROJECT_IDS_KEY), null)
  const ids = readSavedIds()
  assert.deepEqual(ids, [])
})

test('T-1: readSavedIds() returns [] when localStorage is unavailable (SSR/non-browser guard)', () => {
  const originalStorage = globalThis.localStorage
  // @ts-expect-error simulating non-browser environment
  delete globalThis.localStorage

  try {
    const ids = readSavedIds()
    assert.deepEqual(ids, [])
  } finally {
    globalThis.localStorage = originalStorage
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// T-2 (Toggle Save - Add)
// ─────────────────────────────────────────────────────────────────────────────

test('T-2: toggleSaveJob(101) adds 101 and returns { jobId: 101, isSaved: true }', async () => {
  const result = await toggleSaveJob(101)

  assert.deepEqual(result, { jobId: 101, isSaved: true })
  assert.deepEqual(readSavedIds(), [101])

  const storedRaw = mockStorage.getItem(SAVED_PROJECT_IDS_KEY)
  assert.equal(storedRaw, JSON.stringify([101]))
})

test('T-2: toggleSaveJob preserves existing saved IDs when adding a new item', async () => {
  await toggleSaveJob(101)
  const result = await toggleSaveJob(202)

  assert.deepEqual(result, { jobId: 202, isSaved: true })
  assert.deepEqual(readSavedIds(), [101, 202])
})

// ─────────────────────────────────────────────────────────────────────────────
// T-3 (Toggle Save - Remove)
// ─────────────────────────────────────────────────────────────────────────────

test('T-3: calling toggleSaveJob(101) again removes 101 and returns { jobId: 101, isSaved: false }', async () => {
  await toggleSaveJob(101)
  assert.deepEqual(readSavedIds(), [101])

  const result = await toggleSaveJob(101)
  assert.deepEqual(result, { jobId: 101, isSaved: false })
  assert.deepEqual(readSavedIds(), [])
  assert.equal(mockStorage.getItem(SAVED_PROJECT_IDS_KEY), JSON.stringify([]))
})

test('T-3: toggleSaveJob removes target ID while leaving other saved IDs intact', async () => {
  saveSavedIds([101, 202, 303])
  assert.deepEqual(readSavedIds(), [101, 202, 303])

  const result = await toggleSaveJob(202)
  assert.deepEqual(result, { jobId: 202, isSaved: false })
  assert.deepEqual(readSavedIds(), [101, 303])
})

// ─────────────────────────────────────────────────────────────────────────────
// T-4 (Corrupted Storage Handling)
// ─────────────────────────────────────────────────────────────────────────────

test('T-4: readSavedIds recovers gracefully when localStorage contains malformed JSON', () => {
  mockStorage.setItem(SAVED_PROJECT_IDS_KEY, 'malformed{json:invalid}')

  const ids = readSavedIds()
  assert.deepEqual(ids, [])
})

test('T-4: readSavedIds recovers gracefully when stored JSON is not an array', () => {
  mockStorage.setItem(SAVED_PROJECT_IDS_KEY, JSON.stringify({ notAnArray: true }))
  assert.deepEqual(readSavedIds(), [])

  mockStorage.setItem(SAVED_PROJECT_IDS_KEY, JSON.stringify('a plain string'))
  assert.deepEqual(readSavedIds(), [])

  mockStorage.setItem(SAVED_PROJECT_IDS_KEY, JSON.stringify(12345))
  assert.deepEqual(readSavedIds(), [])
})

test('T-4: readSavedIds filters out corrupted/non-primitive elements in array', () => {
  const corruptedArray = [null, undefined, 101, { invalid: true }, 'proj-999', true, false]
  mockStorage.setItem(SAVED_PROJECT_IDS_KEY, JSON.stringify(corruptedArray))

  const ids = readSavedIds()
  assert.deepEqual(ids, [101, 'proj-999'])
})

test('T-4: saveSavedIds handles storage write failures without throwing', () => {
  const throwingStorage = {
    getItem: () => null,
    setItem: () => {
      throw new Error('QuotaExceededError')
    },
    removeItem: () => {},
    clear: () => {},
    length: 0,
    key: () => null,
  } as Storage

  const originalStorage = globalThis.localStorage
  globalThis.localStorage = throwingStorage

  try {
    assert.doesNotThrow(() => {
      saveSavedIds([101, 202])
    })
  } finally {
    globalThis.localStorage = originalStorage
  }
})

// ─────────────────────────────────────────────────────────────────────────────
// T-5 (Parallel Fetching & Graceful Missing ID Handling)
// ─────────────────────────────────────────────────────────────────────────────

test('T-5: getSavedJobs() returns [] immediately when no IDs are saved', async () => {
  const jobs = await getSavedJobs()
  assert.deepEqual(jobs, [])
})

test('T-5: getSavedJobs() resolves valid mock/backend listings for saved IDs', async () => {
  // ID 1 exists in mock listings
  saveSavedIds([1])

  const jobs = await getSavedJobs()
  assert.equal(jobs.length, 1)
  assert.equal(jobs[0].id, 1)
  assert.equal(typeof jobs[0].title, 'string')
})

test('T-5: getSavedJobs() resolves via custom resolver when provided', async () => {
  setCustomJobResolver(async (id) => {
    if (String(id) === 'custom-99') {
      return {
        id: 'custom-99',
        title: 'Custom Injected Project',
        clientName: 'Client X',
        company: 'Company X',
        companyInitials: 'CX',
        companyColor: '#000',
        postedAgo: '1 ngày trước',
        budget: '20.000.000 ₫',
        salaryType: 'monthly',
        salaryValue: 20000000,
        description: 'Test description',
        skills: ['React', 'TypeScript'],
        hiring: true,
        viewsCount: 10,
        submitsCount: 2,
        openPositions: 1,
        filledPositions: 0,
        status: 'OPEN',
        experienceLevel: 'intermediate',
      }
    }
    return null
  })

  saveSavedIds(['custom-99'])
  const jobs = await getSavedJobs()
  assert.equal(jobs.length, 1)
  assert.equal(jobs[0].id, 'custom-99')
  assert.equal(jobs[0].title, 'Custom Injected Project')
})

test('T-5: getSavedJobs() discards missing or deleted IDs without crashing', async () => {
  // ID 1 is valid; 999999 and 'missing-id' do not exist
  saveSavedIds([1, 999999, 'missing-id-404'])

  const jobs = await getSavedJobs()
  assert.equal(jobs.length, 1)
  assert.equal(jobs[0].id, 1)
})

// ─────────────────────────────────────────────────────────────────────────────
// T-6 (Type Compatibility: String and Numeric IDs)
// ─────────────────────────────────────────────────────────────────────────────

test('T-6: handles both numeric and string IDs in storage', async () => {
  await toggleSaveJob(1)
  await toggleSaveJob('proj-999')

  const ids = await getSavedJobIds()
  assert.deepEqual(ids, [1, 'proj-999'])
})

test('T-6: handles type-coerced toggling without duplicate entries (numeric vs string)', async () => {
  // Save numeric 101
  await toggleSaveJob(101)
  assert.deepEqual(readSavedIds(), [101])

  // Toggling string '101' should match numeric 101 and remove it
  const removeResult = await toggleSaveJob('101')
  assert.equal(removeResult.isSaved, false)
  assert.deepEqual(readSavedIds(), [])
})
