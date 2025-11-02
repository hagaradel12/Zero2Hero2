import axios from 'axios';

const AI_SERVICE_URL =
  process.env.AI_SERVICE_URL || 'http://localhost:8000';

interface CallAIReviewParams {
  userId: string;
  questionId: string;
  code: string;
  expectedOutput?: string;
  language?: 'python' | 'java';
  usedHints?: number;
  task: string;
}

interface GetHintParams {
  userId: string;
  questionId: string;
  task: string;
  code: string;
  language?: 'python' | 'java';
}

// === Review Function ===
export async function callAIReview({
  userId,
  questionId,
  code,
  expectedOutput = '',
  language = 'python',
  usedHints = 0,
  task,
}: CallAIReviewParams) {
  try {
    const response = await axios.post( `${AI_SERVICE_URL}/api/review`, {
      userId,
      questionId,
      code,
      expectedOutput,
      language,
      usedHints,
      task,
    });

    const data = response.data?.data ?? {};

    return {
      score: data.score ?? 0,
      feedback: data.aiFeedback ?? 'No feedback received.',
      passed: data.passed ?? false,
      hints: data.aiHints ?? [],
      testResults: data.testResults ?? [],
    };
  } catch (error: any) {
    console.error('❌ AI Review API Error:', {
      status: error?.response?.status,
      data: error?.response?.data,
      message: error.message,
    });
    throw new Error('Failed to connect to AI Review service');
  }
}

// === Hint Function ===
export async function getAIHint({
  userId,
  questionId,
  task,
  code,
  language = 'python',
}: GetHintParams) {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/api/hints`, {
      userId,
      questionId,
      code,
      task,
      language,
    });

    const data = response.data?.data ?? {};

    return {
      hint: data.hint ?? 'No hint available.',
      explanation: data.explanation ?? '',
    };
  } catch (error: any) {
    console.error('❌ AI Hint API Error:', {
      status: error?.response?.status,
      data: error?.response?.data,
      message: error.message,
    });
    throw new Error('Failed to connect to AI Hint service');
  }
}
