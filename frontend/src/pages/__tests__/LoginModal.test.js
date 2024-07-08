

import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import LoginModal from '../LoginModal'; // Adjust the import path based on your file structure
import { AuthProvider } from '../../context/AuthContext';
import apiClient from '../../axiosConfig'; // Adjust the import path based on your file structure
import MockAdapter from 'axios-mock-adapter';

describe('LoginModal Component', () => {
  let mock;

  beforeAll(() => {
    mock = new MockAdapter(apiClient);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  const renderLoginModal = async (isOpen = true, initialIsLogin = true) => {
    await act(async () => {
      render(
        <AuthProvider>
          <LoginModal isOpen={isOpen} onClose={() => {}} initialIsLogin={initialIsLogin} />
        </AuthProvider>
      );
    });
  };

  test('handles login submission with valid data', async () => {
    mock.onPost('/auth/login').reply(200, {});

    await renderLoginModal();

    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Password123!' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(screen.queryByText('Login failed. Please check your credentials and try again.')).not.toBeInTheDocument();
    });
  });

  test('handles sign up submission with valid data', async () => {
    mock.onPost('/auth/signup').reply(200, {});

    await renderLoginModal(true, false);

    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/phone number/i), { target: { value: '1234567890' } });
    fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: 'john.doe@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'Password123!' } });
    
    const signUpButtons = screen.getAllByRole('button', { name: /sign up/i });
    fireEvent.click(signUpButtons[1]);

    await waitFor(() => {
      expect(screen.queryByText('Registration failed. Please try again.')).not.toBeInTheDocument();
    });
  });

});


