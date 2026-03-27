import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Group, Button, Text, Box } from '@mantine/core';

function Navbar() {
  const location = useLocation();

  const links = [
    { label: 'Dashboard', path: '/' },
    { label: 'Employees', path: '/employees' },
    { label: 'Projects', path: '/projects' },
    { label: 'Tasks', path: '/tasks' },
  ];

  return (
    <Box style={{ background: '#a84fbb', padding: '12px 24px' }}>
      <Group justify="space-between">
        <Text c="white" fw={700} size="lg">📋 Project Management Dashboard</Text>
        <Group>
          {links.map((link) => (
            <Button
              key={link.path}
              component={Link}
              to={link.path}
              variant={location.pathname === link.path ? 'white' : 'subtle'}
              color={location.pathname === link.path ? 'blue' : 'white'}
              size="sm"
            >
              {link.label}
            </Button>
          ))}
        </Group>
      </Group>
    </Box>
  );
}

export default Navbar;