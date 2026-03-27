import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Button, Table, Text, Title, Group, Badge } from '@mantine/core';
import TaskForm from '../components/TaskForm';

function Tasks() {
  const { tasks, projects, employees, deleteTask } = useAppContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleEdit = (task) => { setSelected(task); setModalOpen(true); };
  const handleAdd = () => { setSelected(null); setModalOpen(true); };
  const handleClose = () => { setModalOpen(false); setSelected(null); };

  return (
    <div>
      <Group justify="space-between" mb="md">
        <Title order={2}>Tasks</Title>
        <Button onClick={handleAdd} color="blue">+ Add Task</Button>
      </Group>

      {tasks.length === 0 && <Text c="dimmed">No tasks yet. Add one!</Text>}

      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Title</Table.Th>
            <Table.Th>Project</Table.Th>
            <Table.Th>Assigned To</Table.Th>
            <Table.Th>ETA</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {tasks.map((task) => {
            const project = projects.find((p) => p.id === task.projectId);
            const employee = employees.find((e) => e.id === task.employeeId);
            return (
              <Table.Tr key={task.id}>
                <Table.Td>{task.title}</Table.Td>
                <Table.Td>{project?.title || '-'}</Table.Td>
                <Table.Td>{employee?.name || '-'}</Table.Td>
                <Table.Td>{task.eta}</Table.Td>
                <Table.Td><Badge color="blue">{task.status}</Badge></Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <Button size="xs" variant="outline" onClick={() => handleEdit(task)}>Edit</Button>
                    <Button size="xs" color="red" variant="outline" onClick={() => deleteTask(task.id)}>Delete</Button>
                  </Group>
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>

      <TaskForm opened={modalOpen} onClose={handleClose} existing={selected} />
    </div>
  );
}

export default Tasks;