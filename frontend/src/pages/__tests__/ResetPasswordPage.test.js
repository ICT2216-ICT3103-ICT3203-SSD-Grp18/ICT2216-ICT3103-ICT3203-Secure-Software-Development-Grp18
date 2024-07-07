import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import '@testing-library/jest-dom';  // Add this import
import ResetPasswordPage from '../ResetPasswordPage';
import apiClient from '../../axiosConfig';

// Mock apiClient
jest.mock('../../axiosConfig', () => {
  const mockAxiosInstance = {
    create: jest.fn(() => mockAxiosInstance),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
    post: jest.fn(),
  };
  return mockAxiosInstance;
});

describe('ResetPasswordPage', () => {
  test('renders ResetPasswordPage component', () => {
    render(
      <MemoryRouter initialEntries={['/reset-password/123']}>
        <Routes>
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: /Reset Password/i })).toBeInTheDocument();
  });

  test('displays error message when passwords do not match', () => {
    render(
      <MemoryRouter initialEntries={['/reset-password/123']}>
        <Routes>
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/New Password:/i), {
      target: { value: 'password1' },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password:/i), {
      target: { value: 'password2' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Reset Password/i }));

    expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
  });

  test('displays success message on successful password reset', async () => {
    apiClient.post.mockResolvedValue({ status: 200 });

    render(
      <MemoryRouter initialEntries={['/reset-password/123']}>
        <Routes>
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/New Password:/i), {
      target: { value: 'password1' },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password:/i), {
      target: { value: 'password1' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Reset Password/i }));

    expect(await screen.findByText(/Password reset successfully/i)).toBeInTheDocument();
  });

  test('displays error message on failed password reset', async () => {
    apiClient.post.mockRejectedValue(new Error('Network Error'));

    render(
      <MemoryRouter initialEntries={['/reset-password/123']}>
        <Routes>
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/New Password:/i), {
      target: { value: 'password1' },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password:/i), {
      target: { value: 'password1' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Reset Password/i }));

    expect(await screen.findByText(/Error: Network Error/i)).toBeInTheDocument();
  });
});
