import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { 
  initializeFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp, 
  getDocFromServer,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  writeBatch,
  increment
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
}, firebaseConfig.firestoreDatabaseId);
export const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
}

export async function logout() {
  await signOut(auth);
}

// Test connection on boot
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error: any) {
    if (error.message?.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}
testConnection();

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  points: number;
  xp: number;
  level: number;
  rank: string;
  streak: number;
  lastActivityAt: any;
  createdAt: any;
  updatedAt: any;
  isAdmin: boolean;
}

export async function ensureUserProfile(user: any): Promise<UserProfile> {
  const userDocRef = doc(db, 'users', user.uid);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    const isAdminEmail = user.email === 'torresokubor07@gmail.com';
    const initialProfile: UserProfile = {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      points: 0,
      xp: 0,
      level: 1,
      rank: 'Bronze',
      streak: 0,
      lastActivityAt: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isAdmin: isAdminEmail,
    };
    await setDoc(userDocRef, initialProfile);
    return initialProfile;
  }

  return userDoc.data() as UserProfile;
}

// Tasks
export interface Task {
  id?: string;
  userId: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed' | 'overdue';
  dueDate: any;
  pointsValue: number;
  completedAt?: any;
  createdAt: any;
  updatedAt: any;
}

export const TASK_POINTS = {
  low: 10,
  medium: 25,
  high: 50
};

export async function createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'pointsValue'>) {
  try {
    const taskDocRef = doc(collection(db, 'tasks'));
    const newTask: Task = {
      ...taskData as Task,
      pointsValue: TASK_POINTS[taskData.priority],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    await setDoc(taskDocRef, newTask);
    return taskDocRef.id;
  } catch (error) {
    handleFirestoreError(error, 'create', 'tasks');
  }
}

export async function completeTask(taskId: string, userId: string, pointsValue: number) {
  try {
    const batch = writeBatch(db);
    
    // 1. Mark task as completed
    const taskRef = doc(db, 'tasks', taskId);
    batch.update(taskRef, {
      status: 'completed',
      completedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // 2. Award points and XP to user
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) throw new Error('User not found');
    const userData = userDoc.data() as UserProfile;

    const newPoints = (userData.points || 0) + pointsValue;
    const newXP = (userData.xp || 0) + pointsValue;
    const newLevel = Math.floor(Math.sqrt(newXP / 100)) + 1;
    
    // Rank logic
    let newRank = 'Bronze';
    if (newXP >= 100000) newRank = 'Legendary';
    else if (newXP >= 40000) newRank = 'Diamond';
    else if (newXP >= 15000) newRank = 'Platinum';
    else if (newXP >= 5000) newRank = 'Gold';
    else if (newXP >= 1000) newRank = 'Silver';

    batch.update(userRef, {
      points: newPoints,
      xp: newXP,
      level: newLevel,
      rank: newRank,
      updatedAt: serverTimestamp()
    });

    // 3. Create transaction log
    const transRef = doc(collection(db, 'transactions'));
    batch.set(transRef, {
      userId,
      amount: pointsValue,
      type: 'earn',
      reason: `Completed task: ${taskId}`,
      relatedId: taskId,
      createdAt: serverTimestamp()
    });

    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, 'update', `tasks/${taskId}`);
  }
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: 'create' | 'update' | 'delete' | 'list' | 'get' | 'write';
  path: string | null;
  authInfo: any;
}

export function handleFirestoreError(error: any, operationType: any, path: string | null = null) {
  const authInfo = auth.currentUser ? {
    userId: auth.currentUser.uid,
    email: auth.currentUser.email,
    emailVerified: auth.currentUser.emailVerified,
    isAnonymous: auth.currentUser.isAnonymous,
    providerInfo: auth.currentUser.providerData.map(p => ({
      providerId: p.providerId,
      displayName: p.displayName,
      email: p.email
    }))
  } : null;

  const errorInfo: FirestoreErrorInfo = {
    error: error.message || 'Unknown Firestore error',
    operationType,
    path,
    authInfo
  };
  console.error(errorInfo);
  throw JSON.stringify(errorInfo);
}
