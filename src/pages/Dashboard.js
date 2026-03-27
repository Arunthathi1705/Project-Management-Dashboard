import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Title, Select, Group, Text, Paper } from '@mantine/core';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import TaskCard from '../components/TaskCard';

const COLUMNS = ['Need to Do', 'In Progress', 'Need for Test', 'Completed', 'Re-open'];

const COLUMN_COLORS = {
  'Need to Do': '#e7f5ff',
  'In Progress': '#fff9db',
  'Need for Test': '#f3f0ff',
  'Completed': '#ebfbee',
  'Re-open': '#fff0f6',
};

function Dashboard() {
  const { tasks, projects, moveTask } = useAppContext();
  const [filterProject, setFilterProject] = useState('');

  const filteredTasks = filterProject
    ? tasks.filter((t) => t.projectId === filterProject)
    : tasks;

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const taskId = result.draggableId;
    const newStatus = result.destination.droppableId;
    moveTask(taskId, newStatus);
  };

  return (
    <div>
      <Group justify="space-between" mb="md">
        <Title order={2}>📋 Dashboard</Title>
        <Select
          placeholder="Filter by project"
          clearable
          data={projects.map((p) => ({ value: p.id, label: p.title }))}
          value={filterProject}
          onChange={(val) => setFilterProject(val || '')}
          style={{ width: 220 }}
        />
      </Group>

      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: 'flex', gap: 12, overflowX: 'auto' }}>
          {COLUMNS.map((col) => {
            const colTasks = filteredTasks.filter((t) => t.status === col);
            return (
              <div key={col} style={{ minWidth: 220, flex: 1 }}>
                <Paper
                  p="sm"
                  radius="md"
                  style={{ background: COLUMN_COLORS[col], minHeight: 500 }}
                >
                  <Text fw={700} mb="sm" size="sm">{col}</Text>
                  <Text size="xs" c="dimmed" mb="sm">{colTasks.length} task(s)</Text>

                  <Droppable droppableId={col}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        style={{ minHeight: 400 }}
                      >
                        {colTasks.map((task, index) => (
                          <TaskCard key={task.id} task={task} index={index} />
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </Paper>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}

export default Dashboard;
