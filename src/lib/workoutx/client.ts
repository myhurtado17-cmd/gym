export interface WorkoutXExercise {
  id: string;
  name: string;
  bodyPart: string;
  target: string;
  equipment: string;
  gifUrl: string;
  instructions: string[];
  secondaryMuscles: string[];
}

const BASE_URL = 'https://api.workoutxapp.com/v1';

function getKey(): string {
  const key = process.env.WORKOUTX_API_KEY;
  if (!key) throw new Error('WORKOUTX_API_KEY is not set');
  return key;
}

async function request<T>(path: string): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    headers: { 'X-WorkoutX-Key': getKey() }
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(`WorkoutX API error ${res.status}: ${body.message}`);
  }

  return res.json();
}

export async function searchByName(name: string): Promise<WorkoutXExercise[]> {
  const encoded = encodeURIComponent(name.trim());
  return request<WorkoutXExercise[]>(`/exercises/name/${encoded}`);
}

export async function getById(id: string): Promise<WorkoutXExercise> {
  return request<WorkoutXExercise>(`/exercises/exercise/${id}`);
}
