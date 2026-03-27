import React, { useEffect, useState } from 'react';
import { Modal, TextInput, Textarea, Button, Stack, Text, Select, Group } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import { useAppContext } from '../context/AppContext';

const schema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  eta: yup.string().required('ETA is required'),
});

const STATUSES = ['Need to Do', 'In Progress', 'Need for Test', 'Completed', 'Re-open'];

function TaskForm({ opened, onClose, existing }) {
  const { addTask, updateTask, projects, employees } = useAppContext();
  const [projectId, setProjectId] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [status, setStatus] = useState('Need to Do');
  const [images, setImages] = useState([]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (existing) {
      reset({ title: existing.title, description: existing.description, eta: existing.eta });
      setProjectId(existing.projectId || '');
      setEmployeeId(existing.employeeId || '');
      setStatus(existing.status || 'Need to Do');
      setImages(existing.images || []);
    } else {
      reset({ title: '', description: '', eta: '' });
      setProjectId('');
      setEmployeeId('');
      setStatus('Need to Do');
      setImages([]);
    }
    // eslint-disable-next-line
  }, [existing, opened]);

  const selectedProject = projects.find((p) => p.id === projectId);
  const availableEmployees = selectedProject
    ? employees.filter((e) => selectedProject.employeeIds?.includes(e.id))
    : [];

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () =>
        setImages((prev) => [...prev, reader.result]);
      reader.readAsDataURL(file);
    });
  };

  const onSubmit = (data) => {
    if (!projectId) { alert('Please select a project'); return; }
    if (!employeeId) { alert('Please select an employee'); return; }

    const payload = { ...data, projectId, employeeId, status, images };
    if (existing) {
      updateTask(existing.id, payload);
    } else {
      addTask({ id: uuidv4(), ...payload });
    }
    onClose();
  };

  return (
    <Modal opened={opened} onClose={onClose} title={existing ? 'Edit Task' : 'Add Task'} centered size="md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <TextInput label="Task Title" {...register('title')} error={errors.title?.message} />
          <Textarea label="Description" {...register('description')} error={errors.description?.message} />

          <Select
            label="Project"
            placeholder="Select project"
            data={projects.map((p) => ({ value: p.id, label: p.title }))}
            value={projectId}
            onChange={(val) => { setProjectId(val); setEmployeeId(''); }}
          />

          <Select
            label="Assign Employee"
            placeholder={projectId ? 'Select employee' : 'Select a project first'}
            data={availableEmployees.map((e) => ({ value: e.id, label: e.name }))}
            value={employeeId}
            onChange={setEmployeeId}
            disabled={!projectId}
          />

          <TextInput label="ETA (Deadline)" type="date" {...register('eta')} error={errors.eta?.message} />

          <Select
            label="Status"
            data={STATUSES}
            value={status}
            onChange={setStatus}
          />

          <div>
            <Text size="sm" fw={500} mb={4}>Reference Images</Text>
            <input type="file" accept="image/*" multiple onChange={handleImages} />
            <Group mt="xs">
              {images.map((img, i) => (
                <img key={i} src={img} alt="" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} />
              ))}
            </Group>
          </div>

          <Button type="submit" color="blue">{existing ? 'Update' : 'Add'} Task</Button>
        </Stack>
      </form>
    </Modal>
  );
}

export default TaskForm;