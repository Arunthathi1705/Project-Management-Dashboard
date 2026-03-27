import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Button, Grid, Card, Text, Avatar, Group, Badge, Title, Stack } from '@mantine/core';
import EmployeeForm from '../components/EmployeeForm';

function Employees() {
  const { employees, deleteEmployee } = useAppContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const handleEdit = (emp) => {
    setSelected(emp);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setSelected(null);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setSelected(null);
  };

  return (
    <div>
      <Group justify="space-between" mb="md">
        <Title order={2}>Employees</Title>
        <Button onClick={handleAdd} color="blue">+ Add Employee</Button>
      </Group>

      {employees.length === 0 && (
        <Text c="dimmed">No employees yet. Add one!</Text>
      )}

      <Grid>
        {employees.map((emp) => (
          <Grid.Col span={4} key={emp.id}>
            <Card shadow="sm" padding="md" radius="md" withBorder>
              <Stack align="center" mb="sm">
                <Avatar src={emp.image} size={80} radius="50%" />
                <Text fw={600}>{emp.name}</Text>
                <Badge color="blue">{emp.position}</Badge>
                <Text size="sm" c="dimmed">{emp.email}</Text>
              </Stack>
              <Group justify="center">
                <Button size="xs" variant="outline" onClick={() => handleEdit(emp)}>Edit</Button>
                <Button size="xs" color="red" variant="outline" onClick={() => deleteEmployee(emp.id)}>Delete</Button>
              </Group>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      <EmployeeForm opened={modalOpen} onClose={handleClose} existing={selected} />
    </div>
  );
}

export default Employees;