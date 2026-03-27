import React, { useEffect, useState } from 'react';
import { Modal, TextInput, Button, Stack, Text } from '@mantine/core';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
import { useAppContext } from '../context/AppContext';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  position: yup.string().required('Position is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
});

function EmployeeForm({ opened, onClose, existing }) {
  const { addEmployee, updateEmployee, employees } = useAppContext();
  const [image, setImage] = useState('');
  const [imageError, setImageError] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (existing) {
      reset({ name: existing.name, position: existing.position, email: existing.email });
      setImage(existing.image || '');
    } else {
      reset({ name: '', position: '', email: '' });
      setImage('');
    }
    setImageError('');
    // eslint-disable-next-line
  }, [existing, opened]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const onSubmit = (data) => {
    // Check unique email
    const duplicate = employees.find(
      (e) => e.email === data.email && e.id !== existing?.id
    );
    if (duplicate) {
      alert('This email is already used by another employee.');
      return;
    }
    if (!image) {
      setImageError('Profile image is required');
      return;
    }
    if (existing) {
      updateEmployee(existing.id, { ...data, image });
    } else {
      addEmployee({ id: uuidv4(), ...data, image });
    }
    onClose();
  };

  return (
    <Modal opened={opened} onClose={onClose} title={existing ? 'Edit Employee' : 'Add Employee'} centered>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <TextInput label="Name" placeholder="Full name" {...register('name')} error={errors.name?.message} />
          <TextInput label="Position" placeholder="e.g. Developer" {...register('position')} error={errors.position?.message} />
          <TextInput label="Official Email" placeholder="email@company.com" {...register('email')} error={errors.email?.message} />

          <div>
            <Text size="sm" fw={500} mb={4}>Profile Image</Text>
            <input type="file" accept="image/*" onChange={handleImage} />
            {imageError && <Text size="xs" c="red">{imageError}</Text>}
            {image && <img src={image} alt="preview" style={{ width: 60, height: 60, borderRadius: '50%', marginTop: 8 }} />}
          </div>

          <Button type="submit" color="blue">{existing ? 'Update' : 'Add'} Employee</Button>
        </Stack>
      </form>
    </Modal>
  );
}

export default EmployeeForm;