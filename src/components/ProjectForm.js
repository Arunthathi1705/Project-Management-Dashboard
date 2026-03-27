import React, { useEffect, useState } from 'react';
import { Modal, TextInput, Textarea, Button, Stack, Text, Checkbox } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import { useAppContext } from '../context/AppContext';

const schema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  startDate: yup.string().required('Start date is required'),
  endDate: yup.string().required('End date is required'),
});

function ProjectForm({ opened, onClose, existing }) {
  const { addProject, updateProject, employees } = useAppContext();
  const [logo, setLogo] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (existing) {
      reset({
        title: existing.title,
        description: existing.description,
        startDate: existing.startDate,
        endDate: existing.endDate,
      });
      setLogo(existing.logo || '');
      setSelectedEmployees(existing.employeeIds || []);
    } else {
      reset({ title: '', description: '', startDate: '', endDate: '' });
      setLogo('');
      setSelectedEmployees([]);
    }
    // eslint-disable-next-line
  }, [existing, opened]);

  const handleLogo = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setLogo(reader.result);
    reader.readAsDataURL(file);
  };

  const toggleEmployee = (id) => {
    setSelectedEmployees((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const onSubmit = (data) => {
    if (data.startDate >= data.endDate) {
      alert('Start date must be before end date.');
      return;
    }
    const payload = { ...data, logo, employeeIds: selectedEmployees };
    if (existing) {
      updateProject(existing.id, payload);
    } else {
      addProject({ id: uuidv4(), ...payload });
    }
    onClose();
  };

  return (
    <Modal opened={opened} onClose={onClose} title={existing ? 'Edit Project' : 'Add Project'} centered size="md">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <TextInput label="Project Title" {...register('title')} error={errors.title?.message} />
          <Textarea label="Description" {...register('description')} error={errors.description?.message} />

          <div>
            <Text size="sm" fw={500} mb={4}>Project Logo</Text>
            <input type="file" accept="image/*" onChange={handleLogo} />
            {logo && <img src={logo} alt="logo" style={{ width: 60, marginTop: 8 }} />}
          </div>

          <TextInput label="Start Date" type="date" {...register('startDate')} error={errors.startDate?.message} />
          <TextInput label="End Date" type="date" {...register('endDate')} error={errors.endDate?.message} />

          <div>
            <Text size="sm" fw={500} mb={4}>Assign Employees</Text>
            {employees.length === 0 && <Text size="xs" c="dimmed">No employees available</Text>}
            {employees.map((emp) => (
              <Checkbox
                key={emp.id}
                label={`${emp.name} - ${emp.position}`}
                checked={selectedEmployees.includes(emp.id)}
                onChange={() => toggleEmployee(emp.id)}
                mb={4}
              />
            ))}
          </div>

          <Button type="submit" color="blue">{existing ? 'Update' : 'Add'} Project</Button>
        </Stack>
      </form>
    </Modal>
  );
}

export default ProjectForm;