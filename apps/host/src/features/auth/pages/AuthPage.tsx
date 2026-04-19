import { FormEvent, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';

interface AuthPageProps {
  onLogin: (input: { email: string; password: string }) => Promise<void>;
  onRegister: (input: { name: string; email: string; password: string }) => Promise<void>;
}

export function AuthPage({ onLogin, onRegister }: AuthPageProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      if (mode === 'login') {
        await onLogin({ email, password });
      } else {
        await onRegister({ name, email, password });
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="page-stack">
      <Paper variant="outlined" className="panel auth-panel" sx={{ p: { xs: 2.2, md: 3 } }}>
        <Typography className="section-label">Authentication</Typography>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
          {mode === 'login' ? 'Sign in to continue' : 'Create your account'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Securely access your storefront, offers, and protected checkout flows.
        </Typography>

        <Tabs
          value={mode}
          onChange={(_, value: 'login' | 'register') => setMode(value)}
          sx={{ mb: 2 }}
        >
          <Tab label="Login" value="login" />
          <Tab label="Register" value="register" />
        </Tabs>

        <Box component="form" onSubmit={submit}>
          <Stack spacing={1.4}>
            {mode === 'register' ? (
              <TextField
                label="Full name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                fullWidth
              />
            ) : null}

            <TextField
              type="email"
              label="Email address"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              fullWidth
            />

            <TextField
              type="password"
              label="Password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              fullWidth
              slotProps={{ htmlInput: { minLength: 6 } }}
            />

            {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

            <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ mt: 0.4 }}>
              {isSubmitting ? (
                <>
                  <CircularProgress
                    size={16}
                    sx={{ color: 'inherit', mr: 1 }}
                  />
                  Please wait...
                </>
              ) : mode === 'login' ? (
                'Login'
              ) : (
                'Create account'
              )}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </section>
  );
}
