import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Button, Grid, Card, Text, Group, Title, Badge } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import ProjectForm from '../components/ProjectForm';

function Projects() {
  const { projects, deleteProject } = useAppContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const handleEdit = (proj) => { setSelected(proj); setModalOpen(true); };
  const handleAdd = () => { setSelected(null); setModalOpen(true); };
  const handleClose = () => { setModalOpen(false); setSelected(null); };

  return (
    <div>
      <Group justify="space-between" mb="md">
        <Title order={2}>Projects</Title>
        <Button onClick={handleAdd} color="blue">+ Add Project</Button>
      </Group>

      {projects.length === 0 && <Text c="dimmed">No projects yet. Add one!</Text>}

      <Grid>
        {projects.map((proj) => (
          <Grid.Col span={4} key={proj.id}>
            <Card shadow="sm" padding="md" radius="md" withBorder style={{ height: '100%' }}>

              {/* Fixed height image container — card will never grow with image */}
              <div style={{
                width: '100%',
                height: 80,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 10,
                overflow: 'hidden'
              }}>
                {proj.logo
                  ? <img src={proj.logo} alt="logo" style={{ maxHeight: 80, maxWidth: '100%', objectFit: 'contain' }} />
                  : <div style={{ height: 80 }} />
                }
              </div>

              <Text fw={700} size="lg">{proj.title}</Text>
              <Text size="sm" c="dimmed" mb="xs">{proj.description}</Text>
              <Badge color="green" mb="xs">
                {proj.startDate} → {proj.endDate}
              </Badge>
              <Text size="xs" mb="sm">👥 {proj.employeeIds?.length || 0} employees assigned</Text>
              <Group>
                <Button size="xs" variant="outline" onClick={() => navigate(`/projects/${proj.id}`)}>View</Button>
                <Button size="xs" variant="outline" onClick={() => handleEdit(proj)}>Edit</Button>
                <Button size="xs" color="red" variant="outline" onClick={() => deleteProject(proj.id)}>Delete</Button>
              </Group>
            </Card>
          </Grid.Col>
        ))}
      </Grid>

      <ProjectForm opened={modalOpen} onClose={handleClose} existing={selected} />
    </div>
  );
}

export default Projects;