import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { store } from './store';

const queryClient = new QueryClient();

type ColorMode = 'light' | 'dark';

interface ColorModeContextValue {
  mode: ColorMode;
  toggleMode: () => void;
}

const ColorModeContext = createContext<ColorModeContextValue>({
  mode: 'light',
  toggleMode: () => undefined,
});

export function useColorMode() {
  return useContext(ColorModeContext);
}

function resolveInitialMode(): ColorMode {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const stored = window.localStorage.getItem('host-theme-mode');
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  const [mode, setMode] = useState<ColorMode>(resolveInitialMode);

  useEffect(() => {
    window.localStorage.setItem('host-theme-mode', mode);
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  const theme = useMemo(
    () =>
      createTheme({
        typography: {
          fontFamily: "Manrope, 'Segoe UI', Tahoma, sans-serif",
        },
        palette: {
          mode,
          primary: { main: '#174a78' },
          secondary: { main: '#496783' },
          background:
            mode === 'light'
              ? { default: '#f3f5f8', paper: '#ffffff' }
              : { default: '#0f1722', paper: '#172331' },
        },
        shape: {
          borderRadius: 14,
        },
        components: {
          MuiPaper: {
            styleOverrides: {
              root: {
                borderColor: mode === 'light' ? '#d7e0ea' : '#31465d',
              },
            },
          },
          MuiButton: {
            defaultProps: {
              disableElevation: true,
            },
            styleOverrides: {
              root: {
                borderRadius: 999,
                textTransform: 'none',
                fontWeight: 700,
              },
            },
          },
          MuiOutlinedInput: {
            styleOverrides: {
              root: {
                borderRadius: 12,
              },
            },
          },
          MuiTabs: {
            styleOverrides: {
              indicator: {
                height: 3,
                borderRadius: 3,
              },
            },
          },
        },
      }),
    [mode],
  );

  const colorModeContextValue = useMemo(
    () => ({
      mode,
      toggleMode: () => setMode((previous) => (previous === 'light' ? 'dark' : 'light')),
    }),
    [mode],
  );

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ColorModeContext.Provider value={colorModeContextValue}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </ColorModeContext.Provider>
      </QueryClientProvider>
    </Provider>
  );
}
