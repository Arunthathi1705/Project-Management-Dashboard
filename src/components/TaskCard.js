import React from 'react';
import { Card, Text, Avatar, Group } from '@mantine/core';
import { Draggable } from '@hello-pangea/dnd';
import { useAppContext } from '../context/AppContext';

function TaskCard({ task, index }) {
  const { employees } = useAppContext();
  const employee = employees.find((e) => e.id === task.employeeId);

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          shadow="sm"
          padding="sm"
          radius="md"
          withBorder
          mb="sm"
          style={{ ...provided.draggableProps.style, cursor: 'grab' }}
        >
          <Text fw={600} size="sm" mb={4}>{task.title}</Text>

          {task.images?.[0] && (
            <img
              src={task.images[0]}
              alt="ref"
              style={{ width: '100%', height: 60, objectFit: 'cover', borderRadius: 4, marginBottom: 6 }}
            />
          )}

          <Group gap="xs" mb={4}>
            <Avatar src={employee?.image} size={24} radius="50%" />
            <Text size="xs">{employee?.name || 'Unassigned'}</Text>
          </Group>

          <Text size="xs" c="dimmed">📅 {task.eta}</Text>
        </Card>
      )}
    </Draggable>
  );
}

export default TaskCard;