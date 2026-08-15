import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import ApiIndexPage from './page';

jest.mock('@/components/AuthGuard', () => ({ children }: { children: React.ReactNode }) => <>{children}</>);

// The page live-fetches responses when an endpoint is expanded.
beforeAll(() => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ data: [], count: 0 }),
  }) as unknown as typeof fetch;
});

describe('API Index page', () => {
  it('documents the private /api/playlists endpoint', () => {
    render(<ApiIndexPage />);
    expect(screen.getByText('Playlists')).toBeInTheDocument();
    expect(screen.getByText('3 playlists')).toBeInTheDocument();
    // Shown in both the endpoint card and the Quick Access links.
    expect(screen.getAllByText('/api/playlists').length).toBeGreaterThan(0);
  });

  it('shows the sample response and a keyed cURL example when expanded', () => {
    render(<ApiIndexPage />);
    fireEvent.click(screen.getByText('Playlists'));
    expect(screen.getByText('Sample response')).toBeInTheDocument();
    // Private endpoint: the cURL example must include the API key header.
    expect(screen.getByText(/X-API-Key: YOUR_API_KEY/)).toBeInTheDocument();
  });
});
