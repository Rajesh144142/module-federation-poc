import { Box, CircularProgress, Paper, Skeleton, Stack, Typography } from '@mui/material';

interface PanelLoaderProps {
  label?: string;
  minHeight?: number;
}

export function PanelLoader({ label = 'Loading', minHeight = 180 }: PanelLoaderProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 3,
        minHeight,
        borderRadius: 3,
        borderColor: '#d7e0ea',
        display: 'grid',
        placeItems: 'center',
        gap: 1.5,
      }}
    >
      <CircularProgress size={26} />
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Paper>
  );
}

interface GridSkeletonProps {
  count?: number;
  minHeight?: number;
}

export function GridSkeleton({ count = 6, minHeight = 220 }: GridSkeletonProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      }}
    >
      {Array.from({ length: count }, (_, index) => (
        <Paper
          key={`grid-skeleton-${index}`}
          variant="outlined"
          sx={{ p: 2, borderRadius: 3, borderColor: '#d7e0ea', minHeight }}
        >
          <Stack spacing={1.2}>
            <Skeleton variant="rounded" height={120} />
            <Skeleton variant="text" width="42%" />
            <Skeleton variant="text" width="74%" />
            <Skeleton variant="text" width="60%" />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Skeleton variant="text" width={74} />
              <Skeleton variant="rounded" width={96} height={34} />
            </Box>
          </Stack>
        </Paper>
      ))}
    </Box>
  );
}

interface ListSkeletonProps {
  count?: number;
}

export function ListSkeleton({ count = 4 }: ListSkeletonProps) {
  return (
    <Stack spacing={1.2}>
      {Array.from({ length: count }, (_, index) => (
        <Paper
          key={`list-skeleton-${index}`}
          variant="outlined"
          sx={{ p: 2, borderRadius: 2, borderColor: '#d7e0ea' }}
        >
          <Stack spacing={0.8}>
            <Skeleton variant="text" width="40%" />
            <Skeleton variant="text" width="58%" />
            <Skeleton variant="text" width="30%" />
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
}

export function StatCardsSkeleton() {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
      }}
    >
      {Array.from({ length: 3 }, (_, index) => (
        <Paper
          key={`stat-skeleton-${index}`}
          variant="outlined"
          sx={{ p: 2, borderRadius: 2.5, borderColor: '#d7e0ea' }}
        >
          <Skeleton variant="text" width="58%" />
          <Skeleton variant="text" width="78%" sx={{ fontSize: '1.4rem' }} />
        </Paper>
      ))}
    </Box>
  );
}
