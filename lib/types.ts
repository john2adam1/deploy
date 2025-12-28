export interface User {
    id: string
    email: string
    role: "user" | "admin"
    trial_end: string
    subscription_end: string | null
    created_at: string
  }
  
  export interface Category {
    id: string
    title: string
    created_at: string
  }
  
  export interface Test {
    id: string
    category_id: string
    image_url: string
    audio_url: string | null
    question: string
    answers: string[]
    correct_answer: number
    time_limit: number
    created_at: string
  }
  
  export interface TestResult {
    id: string
    user_id: string
    test_id: string
    score: number
    total_questions: number
    correct_answers: number
    wrong_answers: number
    created_at: string
  }
  