import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Title, Text, Badge, Card, Grid, Avatar, Button, Stack } from '@mantine/core';

function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, employees, tasks } = useAppContext();

  const project = projects.find((p) => p.id === id);
  if (!project) return <Text>Project not found.</Text>;

  const assignedEmployees = employees.filter((e) => project.employeeIds?.includes(e.id));
  const projectTasks = tasks.filter((t) => t.projectId === id);

  return (
    <div>
      <Button variant="subtle" onClick={() => navigate('/projects')} mb="md">← Back</Button>
      <Title order={2} mb="xs">{project.title}</Title>
      <Text c="dimmed" mb="xs">{project.description}</Text>
      <Badge color="green" mb="lg">{project.startDate} → {project.endDate}</Badge>

      <Title order={4} mb="sm">Assigned Employees ({assignedEmployees.length})</Title>
      <Grid mb="lg">
        {assignedEmployees.map((emp) => (
          <Grid.Col span={3} key={emp.id}>
            <Card withBorder padding="sm" radius="md">
              <Stack align="center">
                <Avatar src={emp.image} size={50} radius="50%" />
                <Text size="sm" fw={600}>{emp.name}</Text>
                <Badge size="xs">{emp.position}</Badge>
              </Stack>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      <Title order={4} mb="sm">Tasks ({projectTasks.length})</Title>
      <Grid>
        {projectTasks.map((task) => {
          const emp = employees.find((e) => e.id === task.employeeId);
          return (
            <Grid.Col span={4} key={task.id}>
              <Card withBorder padding="sm" radius="md">
                <Text fw={600}>{task.title}</Text>
                <Text size="sm" c="dimmed">{task.description}</Text>
                <Badge color="orange" mt="xs">{task.status}</Badge>
                <Text size="xs" mt="xs">👤 {emp?.name || 'Unassigned'}</Text>
                <Text size="xs">📅 {task.eta}</Text>
              </Card>
            </Grid.Col>
          );
        })}
        {projectTasks.length === 0 && <Text c="dimmed" ml="md">No tasks yet.</Text>}
      </Grid>
    </div>
  );
}

export default ProjectDetail;