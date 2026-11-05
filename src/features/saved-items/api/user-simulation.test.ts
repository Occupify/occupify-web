import assert from 'node:assert/strict'
import {
  readSavedIds,
  saveSavedIds,
  toggleSaveJob,
  getSavedJobs,
  SAVED_PROJECT_IDS_KEY,
} from './get-saved-jobs.ts'

class MockBrowserLocalStorage implements Storage {
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

globalThis.localStorage = new MockBrowserLocalStorage()

async function runRealUserSimulation() {
  console.log('🚀 [SIMULATION START] End-to-End User Simulation: Save Project Workflow')

  // ── Step 0: User opens application for the first time ──
  localStorage.clear()
  console.log('  👤 User arrives at Occupify with clean browser session.')
  let initialSaved = await getSavedJobs()
  assert.equal(initialSaved.length, 0, 'Initial saved projects count must be 0')
  console.log('  ✔ Confirmed initial saved jobs is 0')

  // ── Step 1: User browses Home Feed and bookmarks Project #1 ──
  console.log('  👤 User is on /home and clicks "Lưu dự án" on Job ID 1')
  const saveAction1 = await toggleSaveJob(1)
  assert.equal(saveAction1.isSaved, true, 'Job ID 1 should report isSaved: true')
  assert.deepEqual(readSavedIds(), [1], 'localStorage should contain [1]')
  console.log('  ✔ Project 1 successfully saved to localStorage:', localStorage.getItem(SAVED_PROJECT_IDS_KEY))

  // ── Step 2: User bookmarks Project #2 as well ──
  console.log('  👤 User finds another interesting project (Job ID 2) and saves it')
  const saveAction2 = await toggleSaveJob(2)
  assert.equal(saveAction2.isSaved, true, 'Job ID 2 should report isSaved: true')
  assert.deepEqual(readSavedIds(), [1, 2], 'localStorage should contain [1, 2]')
  console.log('  ✔ Project 2 saved. Current saved IDs:', readSavedIds())

  // ── Step 3: User navigates to /saved (SavedPage) ──
  console.log('  👤 User navigates to /saved to review bookmarks')
  const savedList = await getSavedJobs()
  assert.equal(savedList.length, 2, 'SavedPage should show exactly 2 projects')
  console.log(`  ✔ SavedPage loaded ${savedList.length} projects:`)
  savedList.forEach((job) => {
    console.log(`     - [ID ${job.id}] "${job.title}" | Client: ${job.clientName || job.company} | Budget: ${job.budget}`)
    assert.ok(job.title, 'Job must have a title')
    assert.ok(job.budget, 'Job must have budget display')
  })

  // ── Step 4: User searches within SavedPage ──
  console.log('  👤 User filters saved list by keyword "Redesign" or specific skill')
  const keyword = savedList[0].title.slice(0, 5).toLowerCase()
  const filtered = savedList.filter((job) =>
    job.title.toLowerCase().includes(keyword) ||
    job.company.toLowerCase().includes(keyword) ||
    job.description.toLowerCase().includes(keyword)
  )
  assert.ok(filtered.length >= 1, 'Search filter should find matching projects')
  console.log(`  ✔ Filter for "${keyword}" matched ${filtered.length} project(s)`)

  // ── Step 5: User removes Project #1 from SavedPage ──
  console.log('  👤 User clicks bookmark icon on Project #1 to remove it from saved list')
  const unsaveAction1 = await toggleSaveJob(1)
  assert.equal(unsaveAction1.isSaved, false, 'Project 1 should report isSaved: false')
  assert.deepEqual(readSavedIds(), [2], 'localStorage should now only contain [2]')
  console.log('  ✔ Project 1 removed. Remaining IDs:', readSavedIds())

  // ── Step 6: User removes the last project (Project #2) ──
  console.log('  👤 User removes Project #2 to check empty state transition')
  const unsaveAction2 = await toggleSaveJob(2)
  assert.equal(unsaveAction2.isSaved, false, 'Project 2 should report isSaved: false')
  assert.deepEqual(readSavedIds(), [], 'localStorage should now be empty []')
  const emptySavedList = await getSavedJobs()
  assert.equal(emptySavedList.length, 0, 'Saved projects should be empty')
  console.log('  ✔ Empty state triggered properly. Zero projects remaining in saved list.')

  // ── Step 7: Resilience check - user reloads browser with corrupted storage ──
  console.log('  👤 Simulation: Browser crashes or third-party extension corrupts localStorage key')
  localStorage.setItem(SAVED_PROJECT_IDS_KEY, 'INVALID_JSON_CORRUPTION')
  const recoveredIds = readSavedIds()
  assert.deepEqual(recoveredIds, [], 'Must safely catch corruption and recover without crash')
  const recoveredJobs = await getSavedJobs()
  assert.deepEqual(recoveredJobs, [], 'Must return empty array on corrupted storage')
  console.log('  ✔ System gracefully caught malformed JSON and recovered to safe state.')

  console.log('🎉 [SIMULATION SUCCESS] All 7 user journey checkpoints verified successfully!')
}

runRealUserSimulation().catch((err) => {
  console.error('❌ [SIMULATION FAILED]', err)
  process.exit(1)
})
