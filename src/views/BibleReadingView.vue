<template>
  <div class="bible-reading-page">
    <div class="container py-4">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card bg-church-purple text-white border-0">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-md-8">
                  <h2 class="fw-bold mb-2">
                    <i class="bi bi-book me-2"></i>
                    Bible Reading Plan
                  </h2>
                  <p class="mb-0 opacity-75">
                    Track your journey through God's Word with our comprehensive reading plan
                  </p>
                </div>
                <div class="col-md-4 text-end">
                  <div class="reading-stats">
                    <h3 class="fw-bold">{{ completionPercentage }}%</h3>
                    <small>Completed</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Progress Overview -->
      <div class="row g-4 mb-4">
        <div class="col-md-3 col-6">
          <div class="card border-0 shadow-sm text-center">
            <div class="card-body">
              <i class="bi bi-book-half display-4 church-purple"></i>
              <h5 class="mt-2 mb-0">{{ completedBooks }}</h5>
              <small class="text-muted">Books Completed</small>
            </div>
          </div>
        </div>
        <div class="col-md-3 col-6">
          <div class="card border-0 shadow-sm text-center">
            <div class="card-body">
              <i class="bi bi-file-text display-4 church-purple"></i>
              <h5 class="mt-2 mb-0">{{ completedChapters }}</h5>
              <small class="text-muted">Chapters Read</small>
            </div>
          </div>
        </div>
        <div class="col-md-3 col-6">
          <div class="card border-0 shadow-sm text-center">
            <div class="card-body">
              <i class="bi bi-calendar-week display-4 church-purple"></i>
              <h5 class="mt-2 mb-0">{{ readingStreak }}</h5>
              <small class="text-muted">Day Streak</small>
            </div>
          </div>
        </div>
        <div class="col-md-3 col-6">
          <div class="card border-0 shadow-sm text-center">
            <div class="card-body">
              <i class="bi bi-trophy display-4 church-purple"></i>
              <h5 class="mt-2 mb-0">{{ readingGoal }}%</h5>
              <small class="text-muted">Year Goal</small>
            </div>
          </div>
        </div>
      </div>

      <!-- Reading Plan Sections -->
      <div class="row g-4">
        <!-- Old Testament -->
        <div class="col-lg-6">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white border-0 pb-0">
              <div class="d-flex justify-content-between align-items-center">
                <h5 class="fw-bold mb-0">Old Testament</h5>
                <span class="badge bg-primary">{{ getTestamentProgress('old') }}% Complete</span>
              </div>
            </div>
            <div class="card-body">
              <div class="testament-books">
                <div 
                  v-for="book in oldTestamentBooks" 
                  :key="book.name"
                  class="book-section mb-4"
                >
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <h6 class="fw-bold mb-0">{{ book.name }}</h6>
                    <small class="text-muted">{{ getBookProgress(book.name) }}/{{ book.chapters }} chapters</small>
                  </div>
                  
                  <div class="progress mb-2" style="height: 8px;">
                    <div 
                      class="progress-bar bg-success" 
                      :style="{ width: (getBookProgress(book.name) / book.chapters) * 100 + '%' }"
                    ></div>
                  </div>
                  
                  <div class="chapters-grid">
                    <button
                      v-for="chapter in book.chapters"
                      :key="`${book.name}-${chapter}`"
                      class="chapter-btn"
                      :class="{ 'completed': isChapterCompleted(book.name, chapter) }"
                      @click="toggleChapter(book.name, chapter)"
                      :title="`${book.name} ${chapter}`"
                    >
                      {{ chapter }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- New Testament -->
        <div class="col-lg-6">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white border-0 pb-0">
              <div class="d-flex justify-content-between align-items-center">
                <h5 class="fw-bold mb-0">New Testament</h5>
                <span class="badge bg-primary">{{ getTestamentProgress('new') }}% Complete</span>
              </div>
            </div>
            <div class="card-body">
              <div class="testament-books">
                <div 
                  v-for="book in newTestamentBooks" 
                  :key="book.name"
                  class="book-section mb-4"
                >
                  <div class="d-flex justify-content-between align-items-center mb-2">
                    <h6 class="fw-bold mb-0">{{ book.name }}</h6>
                    <small class="text-muted">{{ getBookProgress(book.name) }}/{{ book.chapters }} chapters</small>
                  </div>
                  
                  <div class="progress mb-2" style="height: 8px;">
                    <div 
                      class="progress-bar bg-success" 
                      :style="{ width: (getBookProgress(book.name) / book.chapters) * 100 + '%' }"
                    ></div>
                  </div>
                  
                  <div class="chapters-grid">
                    <button
                      v-for="chapter in book.chapters"
                      :key="`${book.name}-${chapter}`"
                      class="chapter-btn"
                      :class="{ 'completed': isChapterCompleted(book.name, chapter) }"
                      @click="toggleChapter(book.name, chapter)"
                      :title="`${book.name} ${chapter}`"
                    >
                      {{ chapter }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Reading Notes -->
      <div class="row mt-4">
        <div class="col-12">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-white border-0">
              <h5 class="fw-bold mb-0">Reading Notes & Reflections</h5>
            </div>
            <div class="card-body">
              <form @submit.prevent="saveNote">
                <div class="mb-3">
                  <label for="noteTitle" class="form-label">Reference (Book Chapter:Verse)</label>
                  <input
                    type="text"
                    class="form-control"
                    id="noteTitle"
                    v-model="noteForm.reference"
                    placeholder="e.g., John 3:16"
                  >
                </div>
                <div class="mb-3">
                  <label for="noteContent" class="form-label">Note/Reflection</label>
                  <textarea
                    class="form-control"
                    id="noteContent"
                    v-model="noteForm.content"
                    rows="3"
                    placeholder="Write your thoughts, insights, or prayer requests..."
                  ></textarea>
                </div>
                <button type="submit" class="btn btn-primary" :disabled="!noteForm.content">
                  <i class="bi bi-journal-plus me-2"></i>
                  Save Note
                </button>
              </form>

              <!-- Notes List -->
              <div v-if="notes.length > 0" class="mt-4">
                <h6 class="fw-bold mb-3">Recent Notes</h6>
                <div class="notes-list" style="max-height: 300px; overflow-y: auto;">
                  <div 
                    v-for="note in sortedNotes" 
                    :key="note.id" 
                    class="note-item border rounded p-3 mb-3"
                  >
                    <div class="d-flex justify-content-between align-items-start mb-2">
                      <strong class="church-purple">{{ note.reference }}</strong>
                      <small class="text-muted">{{ formatDate(note.createdAt) }}</small>
                    </div>
                    <p class="mb-0">{{ note.content }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getCurrentUser } from '../utils/auth'

const user = getCurrentUser()

const readingProgress = ref({})
const notes = ref([])
const noteForm = ref({
  reference: '',
  content: ''
})

// Bible books data
const oldTestamentBooks = ref([
  { name: 'Genesis', chapters: 50 },
  { name: 'Exodus', chapters: 40 },
  { name: 'Leviticus', chapters: 27 },
  { name: 'Numbers', chapters: 36 },
  { name: 'Deuteronomy', chapters: 34 },
  { name: 'Joshua', chapters: 24 },
  { name: 'Judges', chapters: 21 },
  { name: 'Ruth', chapters: 4 },
  { name: '1 Samuel', chapters: 31 },
  { name: '2 Samuel', chapters: 24 },
  { name: '1 Kings', chapters: 22 },
  { name: '2 Kings', chapters: 25 },
  { name: '1 Chronicles', chapters: 29 },
  { name: '2 Chronicles', chapters: 36 },
  { name: 'Ezra', chapters: 10 },
  { name: 'Nehemiah', chapters: 13 },
  { name: 'Esther', chapters: 10 },
  { name: 'Job', chapters: 42 },
  { name: 'Psalms', chapters: 150 },
  { name: 'Proverbs', chapters: 31 },
  { name: 'Ecclesiastes', chapters: 12 },
  { name: 'Song of Solomon', chapters: 8 },
  { name: 'Isaiah', chapters: 66 },
  { name: 'Jeremiah', chapters: 52 },
  { name: 'Lamentations', chapters: 5 },
  { name: 'Ezekiel', chapters: 48 },
  { name: 'Daniel', chapters: 12 },
  { name: 'Hosea', chapters: 14 },
  { name: 'Joel', chapters: 3 },
  { name: 'Amos', chapters: 9 },
  { name: 'Obadiah', chapters: 1 },
  { name: 'Jonah', chapters: 4 },
  { name: 'Micah', chapters: 7 },
  { name: 'Nahum', chapters: 3 },
  { name: 'Habakkuk', chapters: 3 },
  { name: 'Zephaniah', chapters: 3 },
  { name: 'Haggai', chapters: 2 },
  { name: 'Zechariah', chapters: 14 },
  { name: 'Malachi', chapters: 4 }
])

const newTestamentBooks = ref([
  { name: 'Matthew', chapters: 28 },
  { name: 'Mark', chapters: 16 },
  { name: 'Luke', chapters: 24 },
  { name: 'John', chapters: 21 },
  { name: 'Acts', chapters: 28 },
  { name: 'Romans', chapters: 16 },
  { name: '1 Corinthians', chapters: 16 },
  { name: '2 Corinthians', chapters: 13 },
  { name: 'Galatians', chapters: 6 },
  { name: 'Ephesians', chapters: 6 },
  { name: 'Philippians', chapters: 4 },
  { name: 'Colossians', chapters: 4 },
  { name: '1 Thessalonians', chapters: 5 },
  { name: '2 Thessalonians', chapters: 3 },
  { name: '1 Timothy', chapters: 6 },
  { name: '2 Timothy', chapters: 4 },
  { name: 'Titus', chapters: 3 },
  { name: 'Philemon', chapters: 1 },
  { name: 'Hebrews', chapters: 13 },
  { name: 'James', chapters: 5 },
  { name: '1 Peter', chapters: 5 },
  { name: '2 Peter', chapters: 3 },
  { name: '1 John', chapters: 5 },
  { name: '2 John', chapters: 1 },
  { name: '3 John', chapters: 1 },
  { name: 'Jude', chapters: 1 },
  { name: 'Revelation', chapters: 22 }
])

const totalChapters = computed(() => {
  const oldTotal = oldTestamentBooks.value.reduce((sum, book) => sum + book.chapters, 0)
  const newTotal = newTestamentBooks.value.reduce((sum, book) => sum + book.chapters, 0)
  return oldTotal + newTotal
})

const completedChapters = computed(() => {
  return Object.keys(readingProgress.value).length
})

const completionPercentage = computed(() => {
  if (totalChapters.value === 0) return 0
  return Math.round((completedChapters.value / totalChapters.value) * 100)
})

const completedBooks = computed(() => {
  let count = 0
  const allBooks = [...oldTestamentBooks.value, ...newTestamentBooks.value]
  
  allBooks.forEach(book => {
    const bookProgress = getBookProgress(book.name)
    if (bookProgress === book.chapters) {
      count++
    }
  })
  
  return count
})

const readingStreak = computed(() => {
  // Calculate consecutive days of reading
  const today = new Date()
  let streak = 0
  let currentDate = new Date(today)
  
  while (true) {
    const dateKey = currentDate.toISOString().split('T')[0]
    const dayProgress = Object.keys(readingProgress.value).some(key => 
      readingProgress.value[key]?.date === dateKey
    )
    
    if (!dayProgress) break
    
    streak++
    currentDate.setDate(currentDate.getDate() - 1)
  }
  
  return streak
})

const readingGoal = computed(() => {
  // Assume goal is to read the entire Bible in a year
  const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000)
  const expectedProgress = Math.round((dayOfYear / 365) * 100)
  return Math.min(completionPercentage.value, 100)
})

const sortedNotes = computed(() => {
  return [...notes.value].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

onMounted(() => {
  loadReadingProgress()
  loadNotes()
})

const loadReadingProgress = () => {
  const userId = user?.id
  if (!userId) return
  
  const saved = localStorage.getItem(`gcbf_bible_${userId}`)
  if (saved) {
    readingProgress.value = JSON.parse(saved)
  }
}

const loadNotes = () => {
  const userId = user?.id
  if (!userId) return
  
  const saved = localStorage.getItem(`gcbf_bible_notes_${userId}`)
  if (saved) {
    notes.value = JSON.parse(saved)
  }
}

const saveReadingProgress = () => {
  const userId = user?.id
  if (!userId) return
  
  localStorage.setItem(`gcbf_bible_${userId}`, JSON.stringify(readingProgress.value))
}

const saveNotes = () => {
  const userId = user?.id
  if (!userId) return
  
  localStorage.setItem(`gcbf_bible_notes_${userId}`, JSON.stringify(notes.value))
}

const isChapterCompleted = (bookName, chapter) => {
  const key = `${bookName}_${chapter}`
  return !!readingProgress.value[key]
}

const toggleChapter = (bookName, chapter) => {
  const key = `${bookName}_${chapter}`
  
  if (readingProgress.value[key]) {
    delete readingProgress.value[key]
  } else {
    readingProgress.value[key] = {
      completed: true,
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString()
    }
  }
  
  saveReadingProgress()
}

const getBookProgress = (bookName) => {
  let count = 0
  const book = [...oldTestamentBooks.value, ...newTestamentBooks.value].find(b => b.name === bookName)
  if (!book) return 0
  
  for (let i = 1; i <= book.chapters; i++) {
    if (isChapterCompleted(bookName, i)) {
      count++
    }
  }
  
  return count
}

const getTestamentProgress = (testament) => {
  const books = testament === 'old' ? oldTestamentBooks.value : newTestamentBooks.value
  let totalChapters = 0
  let completedChapters = 0
  
  books.forEach(book => {
    totalChapters += book.chapters
    completedChapters += getBookProgress(book.name)
  })
  
  return totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0
}

const saveNote = () => {
  if (!noteForm.value.content) return
  
  const newNote = {
    id: Date.now().toString(),
    reference: noteForm.value.reference || 'General',
    content: noteForm.value.content,
    createdAt: new Date().toISOString()
  }
  
  notes.value.push(newNote)
  saveNotes()
  
  // Reset form
  noteForm.value = { reference: '', content: '' }
}

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}
</script>

<style scoped>
.chapters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(35px, 1fr));
  gap: 4px;
  margin-top: 8px;
}

.chapter-btn {
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 6px 4px;
  font-size: 0.8rem;
  font-weight: 500;
  color: #6c757d;
  cursor: pointer;
  transition: all 0.2s ease;
}

.chapter-btn:hover {
  background: #e9ecef;
  border-color: #adb5bd;
}

.chapter-btn.completed {
  background: #9A3F3F;
  border-color: #9A3F3F;
  color: white;
}

.chapter-btn.completed:hover {
  background: #FBF9D1;
  border-color: #FBF9D1;
  color: #333333;
}

.book-section {
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 1rem;
}

.book-section:last-child {
  border-bottom: none;
  margin-bottom: 0 !important;
}

.testament-books {
  max-height: 600px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #9A3F3F #f8f9fa;
}

.testament-books::-webkit-scrollbar {
  width: 6px;
}

.testament-books::-webkit-scrollbar-track {
  background: #f8f9fa;
  border-radius: 3px;
}

.testament-books::-webkit-scrollbar-thumb {
  background: #9A3F3F;
  border-radius: 3px;
}

.testament-books::-webkit-scrollbar-thumb:hover {
  background: #FBF9D1;
}

.reading-stats {
  text-align: center;
}

.note-item {
  transition: all 0.2s ease;
}

.note-item:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.notes-list {
  scrollbar-width: thin;
  scrollbar-color: #9A3F3F #f8f9fa;
}

.notes-list::-webkit-scrollbar {
  width: 6px;
}

.notes-list::-webkit-scrollbar-track {
  background: #f8f9fa;
  border-radius: 3px;
}

.notes-list::-webkit-scrollbar-thumb {
  background: #9A3F3F;
  border-radius: 3px;
}
</style>