
'use client';

import { useState } from 'react';
import { Box, TextField, Button, Typography, Paper } from '@mui/material';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await res.json();
      if (result.success) {
        setMessage(result.message); // Display the success message to the user
        toast.success(result.message);
      } else {
        setMessage(result.message); // Display error message
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Request password reset failed:', error);
      setMessage('An unexpected error occurred. Please try again.');
      toast.error('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: 'grey.100',
      }}
    >
      <Paper elevation={3} sx={{ p: 4, maxWidth: 400, width: '100%', borderRadius: 2 }}>
        <Typography variant="h5" component="h1" align="center" mb={3} fontWeight="bold">
          Forgot Password
        </Typography>
        <Typography variant="body2" align="center" color="text.secondary" mb={3}>
          Enter your email address to receive a password reset link.
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Email Address"
            variant="outlined"
            type="email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </Box>

        {message && (
          <Typography variant="body2" color={message.includes('success') ? 'success.main' : 'error.main'} mt={2} align="center">
            {message}
          </Typography>
        )}

        <Typography variant="body2" align="center" mt={3}>
          <Link href="/admin/login" passHref>
            Back to Login
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}
