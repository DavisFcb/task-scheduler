
import React, { useState } from 'react';
import './App.css';
import MenuAppBar from './component/navbar'


const ASSIGNEES = [
  'Alice',
  'Bob',
  'Charlie',
  'Diana',
];

const STATUS_OPTIONS = [
  'Pending',
  'In Progress',
  'Done',
];

type Task = {
  id: number;
  title: string;
  assignee: string;
  comment: string;
  status: string;
};

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [assignee, setAssignee] = useState(ASSIGNEES[0]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [editComment, setEditComment] = useState('');
  const [editStatus, setEditStatus] = useState(STATUS_OPTIONS[0]);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(STATUS_OPTIONS[0]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setTasks([
      ...tasks,
      {
        id: Date.now(),
        title,
        assignee,
        comment: '',
        status: STATUS_OPTIONS[0],
      },
    ]);
    setTitle('');
    setAssignee(ASSIGNEES[0]);
    setShowModal(false);
    setActiveTab(STATUS_OPTIONS[0]);
  };

  const handleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
    const task = tasks.find(t => t.id === id);
    if (task) {
      setEditComment(task.comment);
      setEditStatus(task.status);
    }
  };

  const handleSave = (id: number) => {
    let newTasks = tasks.map(task =>
      task.id === id
        ? { ...task, comment: editComment, status: editStatus }
        : task
    );
    setTasks(newTasks);
    setExpandedId(null);
    setActiveTab(editStatus); // Switch to tab of updated status
  };

  const handleModalClose = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains('modal-backdrop')) {
      setShowModal(false);
    }
  };

  // Filter tasks by status for tabs
  const tasksByStatus = (status: string) => tasks.filter(t => t.status === status);

  return (
    <div className="App" style={{ maxWidth: 600, margin: '0 auto' }}>
      {/* <MenuAppBar /> */}
      <h1>Task Scheduler</h1>
      <button onClick={() => setShowModal(true)} style={{ marginBottom: 24 }}>Add Task</button>

      {/* Tabs */}
      <div style={{ display: 'flex', marginBottom: 16 }}>
        {STATUS_OPTIONS.map(tab => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setExpandedId(null); }}
            style={{
              flex: 1,
              padding: '10px 0',
              background: activeTab === tab ? '#1976d2' : '#eee',
              color: activeTab === tab ? '#fff' : '#333',
              border: 'none',
              borderRadius: '6px 6px 0 0',
              fontWeight: activeTab === tab ? 'bold' : 'normal',
              cursor: 'pointer',
              marginRight: tab !== STATUS_OPTIONS[STATUS_OPTIONS.length - 1] ? 4 : 0,
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {showModal && (
        <div
          className="modal-backdrop"
          onClick={handleModalClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: '#fff',
              padding: 24,
              borderRadius: 8,
              minWidth: 320,
              boxShadow: '0 2px 16px rgba(0,0,0,0.15)',
              position: 'relative',
            }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              style={{ position: 'absolute', top: 8, right: 8, background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }}
              aria-label="Close"
            >×</button>
            <h2 style={{ marginTop: 0 }}>Add Task</h2>
            <form onSubmit={handleAddTask}>
              <input
                type="text"
                placeholder="Task name"
                value={title}
                onChange={e => setTitle(e.target.value)}
                style={{ marginRight: 8, marginBottom: 8, width: '60%' }}
              />
              <select
                value={assignee}
                onChange={e => setAssignee(e.target.value)}
                style={{ marginRight: 8, marginBottom: 8, width: '35%' }}
              >
                {ASSIGNEES.map(person => (
                  <option key={person} value={person}>{person}</option>
                ))}
              </select>
              <br />
              <button type="submit" style={{ marginTop: 8 }}>Add Task</button>
            </form>
          </div>
        </div>
      )}

      {/* Accordions for active tab */}
      {tasksByStatus(activeTab).length === 0 ? (
        <div style={{ textAlign: 'center', padding: '16px' }}>No tasks in this section.</div>
      ) : (
        <div>
          {tasksByStatus(activeTab).map(task => (
            <div key={task.id} style={{ border: '1px solid #ccc', borderRadius: 6, marginBottom: 12 }}>
              <button
                style={{
                  width: '100%',
                  textAlign: 'left',
                  background: '#f7f7f7',
                  border: 'none',
                  padding: '12px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  borderRadius: '6px 6px 0 0',
                }}
                onClick={() => handleExpand(task.id)}
              >
                {task.title} <span style={{ color: '#888', fontWeight: 'normal' }}>({task.assignee})</span>
                <span style={{ float: 'right', color: '#888', fontWeight: 'normal' }}>{task.status}</span>
              </button>
              {expandedId === task.id && (
                <div style={{ padding: '12px', background: '#fff', borderRadius: '0 0 6px 6px' }}>
                  <div style={{ marginBottom: 8 }}>
                    <label style={{ display: 'block', marginBottom: 4 }}>Comment:</label>
                    <textarea
                      value={editComment}
                      onChange={e => setEditComment(e.target.value)}
                      rows={2}
                      style={{ width: '100%', marginBottom: 8 }}
                    />
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <label style={{ display: 'block', marginBottom: 4 }}>Status:</label>
                    <select
                      value={editStatus}
                      onChange={e => setEditStatus(e.target.value)}
                      style={{ width: '100%' }}
                    >
                      {STATUS_OPTIONS.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                  <button onClick={() => handleSave(task.id)} style={{ marginTop: 8 }}>Save</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
