'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { Alert, Snackbar } from '@mui/material';

export type SnackbarSeverity = 'success' | 'error' | 'info' | 'warning';

export interface ShowSnackbarOptions {
  severity?: SnackbarSeverity;
  autoHideDuration?: number;
}

interface SnackbarContextValue {
  showSnackbar: (message: string, options?: ShowSnackbarOptions) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
}

const SnackbarContext = createContext<SnackbarContextValue | null>(null);

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<SnackbarSeverity>('info');
  const [autoHideDuration, setAutoHideDuration] = useState(4000);

  const showSnackbar = useCallback(
    (nextMessage: string, options?: ShowSnackbarOptions) => {
      setMessage(nextMessage);
      setSeverity(options?.severity ?? 'info');
      setAutoHideDuration(options?.autoHideDuration ?? 4000);
      setOpen(true);
    },
    [],
  );

  const value = useMemo<SnackbarContextValue>(
    () => ({
      showSnackbar,
      success: (msg) => showSnackbar(msg, { severity: 'success' }),
      error: (msg) => showSnackbar(msg, { severity: 'error', autoHideDuration: 6000 }),
      info: (msg) => showSnackbar(msg, { severity: 'info' }),
      warning: (msg) => showSnackbar(msg, { severity: 'warning' }),
    }),
    [showSnackbar],
  );

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={autoHideDuration}
        onClose={(_, reason) => {
          if (reason === 'clickaway') return;
          setOpen(false);
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          severity={severity}
          variant="filled"
          onClose={() => setOpen(false)}
          sx={{ width: '100%', borderRadius: 0 }}
        >
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  const ctx = useContext(SnackbarContext);
  if (!ctx) {
    throw new Error('useSnackbar must be used within SnackbarProvider');
  }
  return ctx;
}
