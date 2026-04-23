import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { db, createTask, completeTask, Task } from '../lib/firebase';
import { collection, query, where, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, CheckSquare, Clock, AlertTriangle, Filter, Trash2 } from 'lucide-react';

export default function Tasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('pending');

  // Form State
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'tasks'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Task[];
      setTasks(taskList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title || !dueDate) return;

    await createTask({
      userId: user.uid,
      title,
      description: '',
      priority,
      status: 'pending',
      dueDate: Timestamp.fromDate(new Date(dueDate))
    });

    setTitle('');
    setShowAddModal(false);
  };

  const filteredTasks = tasks.filter(t => {
    if (filter === 'all') return true;
    return t.status === filter;
  });

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <header className="h-20 bg-brand-surface border-b border-brand-card flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center gap-4">
          <CheckSquare className="text-brand-gold w-6 h-6" />
          <h1 className="text-2xl font-bold text-white uppercase italic tracking-tighter">Operations Terminal</h1>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-brand-gold text-brand-black px-6 py-2 rounded font-bold uppercase tracking-widest text-xs hover:bg-brand-gold-light transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> New Ops
        </button>
      </header>

      {/* Filter Bar */}
      <div className="bg-brand-black/50 p-4 px-8 border-b border-brand-card flex gap-4">
        <FilterButton active={filter === 'pending'} onClick={() => setFilter('pending')} label="Active" />
        <FilterButton active={filter === 'completed'} onClick={() => setFilter('completed')} label="Finished" />
        <FilterButton active={filter === 'all'} onClick={() => setFilter('all')} label="All Logs" />
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto p-8 space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredTasks.length === 0 && !loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-48 flex flex-col items-center justify-center border-2 border-dashed border-brand-card rounded-xl text-brand-ash-dark"
            >
              <AlertTriangle className="w-8 h-8 mb-4 opacity-50" />
              <p className="uppercase tracking-widest text-xs font-bold font-mono">No Active Operations Found</p>
            </motion.div>
          )}

          {filteredTasks.map((task) => (
            <TaskListItem key={task.id} task={task} />
          ))}
        </AnimatePresence>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-sm bg-brand-black/80">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-lg bg-brand-surface border border-brand-gold shadow-[0_0_50px_rgba(201,168,76,0.15)] rounded-2xl overflow-hidden"
          >
            <div className="bg-brand-gold p-4 px-6 flex justify-between items-center">
              <h2 className="text-brand-black font-bold uppercase tracking-widest text-sm">New Mission Briefing</h2>
              <button onClick={() => setShowAddModal(false)} className="text-brand-black hover:scale-110 transition-transform">✕</button>
            </div>
            
            <form onSubmit={handleCreateTask} className="p-8 space-y-6">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-brand-ash-dark font-bold mb-2">Objective Title</label>
                <input 
                  autoFocus
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-brand-black border border-brand-card focus:border-brand-gold outline-none p-4 rounded text-white font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-brand-ash-dark font-bold mb-2">Threat Level (Priority)</label>
                  <select 
                    value={priority}
                    onChange={e => setPriority(e.target.value as any)}
                    className="w-full bg-brand-black border border-brand-card focus:border-brand-gold outline-none p-4 rounded text-white font-medium appearance-none"
                  >
                    <option value="low">Low (+10 Pts)</option>
                    <option value="medium">Medium (+25 Pts)</option>
                    <option value="high">High (+50 Pts)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-brand-ash-dark font-bold mb-2">Exfiltration Date (Due)</label>
                  <input 
                    required
                    type="datetime-local"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="w-full bg-brand-black border border-brand-card focus:border-brand-gold outline-none p-4 rounded text-white font-medium"
                  />
                </div>
              </div>

              <button className="w-full bg-brand-gold text-brand-black font-bold py-4 rounded uppercase tracking-[0.3em] text-xs hover:bg-brand-gold-light transition-all shadow-lg hover:shadow-brand-gold/20">
                Deploy Operation
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

const FilterButton = ({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) => (
  <button 
    onClick={onClick}
    className={`px-4 py-1.5 rounded text-[10px] uppercase tracking-widest font-bold border transition-all ${
      active 
        ? 'bg-brand-gold border-brand-gold text-brand-black' 
        : 'border-brand-card text-brand-ash-dark hover:border-brand-ash'
    }`}
  >
    {label}
  </button>
);

const TaskListItem = ({ task }: { key?: any, task: Task }) => {
  const { user } = useAuth();
  const [completing, setCompleting] = useState(false);

  const handleComplete = async () => {
    if (!user || !task.id || completing) return;
    setCompleting(true);
    await completeTask(task.id, user.uid, task.pointsValue);
    setCompleting(false);
  };

  const priorityColors = {
    low: 'text-brand-ash border-brand-ash',
    medium: 'text-brand-gold border-brand-gold',
    high: 'text-red-500 border-red-500'
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={`group bg-brand-surface border-l-4 p-5 flex items-center justify-between hover:bg-brand-card transition-all ${priorityColors[task.priority]}`}
    >
      <div className="flex-1 min-w-0 mr-6">
        <div className="flex items-center gap-3 mb-2">
          <span className={`text-[10px] font-mono font-black uppercase px-2 py-0.5 border rounded ${priorityColors[task.priority]}`}>
            {task.priority} // {task.pointsValue} PTS
          </span>
          {task.status === 'completed' ? (
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Operation Success</span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] font-bold text-brand-ash-dark uppercase tracking-widest">
              <Clock className="w-3 h-3" /> 
              {task.dueDate.toDate().toLocaleDateString()} {task.dueDate.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
        <h3 className={`text-lg font-medium text-white truncate ${task.status === 'completed' ? 'line-through opacity-50' : ''}`}>
          {task.title}
        </h3>
      </div>

      {task.status === 'pending' && (
        <button 
          onClick={handleComplete}
          disabled={completing}
          className="w-12 h-12 rounded-full border border-brand-card flex items-center justify-center text-brand-ash-dark hover:border-brand-gold hover:text-brand-gold transition-all shrink-0 active:scale-90"
        >
          {completing ? (
            <div className="w-4 h-4 border-2 border-brand-gold border-t-transparent rounded-full animate-spin" />
          ) : (
            <CheckSquare className="w-6 h-6" />
          )}
        </button>
      )}
    </motion.div>
  );
};
