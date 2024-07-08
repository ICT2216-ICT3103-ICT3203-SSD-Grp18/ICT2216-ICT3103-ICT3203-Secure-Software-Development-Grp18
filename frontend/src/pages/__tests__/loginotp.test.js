import React from 'react';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import LoginModal from '../LoginModal';
import { AuthProvider } from '../../context/AuthContext';
import apiClient from '../../axiosConfig'; // Adjust the path as necessary

jest.mock('../../axiosConfig');

describe('LoginModal Input Validation and Sanitization', () => {

  beforeAll(() => {
    // Mock window.alert
    global.alert = jest.fn();
  });

  const renderComponent = async (props) => {
    await act(async () => {
      render(
        <AuthProvider>
          <LoginModal {...props} />
        </AuthProvider>
      );
    });
  };

  // Edge Case: XSS Attack
  test('should sanitize input to prevent XSS attack during login', async () => {
    await renderComponent({ isOpen: true, isLogin: true, onClose: jest.fn() });
    fireEvent.change(screen.getByLabelText('Email Address:'), { target: { value: 'valid.email@example.com' } });
    fireEvent.change(screen.getByLabelText('Password:'), { target: { value: "<script>alert('XSS')</script>" } });
    fireEvent.click(screen.getAllByRole('button', { name: /log in/i })[1]);

    await waitFor(() => expect(global.alert).toHaveBeenCalledWith('Login failed. Please check your credentials and try again.'));
  });


  // Test OTP login flow
  test('should handle OTP login flow correctly', async () => {
    apiClient.post.mockResolvedValueOnce({ data: { otpRequired: true } });
    await renderComponent({ isOpen: true, isLogin: true, onClose: jest.fn() });

    fireEvent.change(screen.getByLabelText('Email Address:'), { target: { value: 'valid.email@example.com' } });
    fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'Valid@123' } });
    fireEvent.click(screen.getAllByRole('button', { name: /log in/i })[1]);

    await waitFor(() => expect(screen.getByLabelText('OTP:')).toBeInTheDocument());
  });

});