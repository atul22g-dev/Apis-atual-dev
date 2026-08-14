import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import SongsPage from '../SongsPage';

const songs = [
  {
    id: 1,
    Name: 'Song One',
    src: 'https://www.youtube.com/watch?v=aaa11111111',
    data: 'https://www.youtube.com/watch?v=aaa11111111',
    videoId: 'aaa11111111',
    artist: 'Artist A',
    thumb: 'https://i.ytimg.com/vi/aaa11111111/hqdefault.jpg',
  },
  {
    id: 2,
    Name: 'Song Two',
    src: 'https://www.youtube.com/watch?v=bbb22222222',
    data: 'https://www.youtube.com/watch?v=bbb22222222',
    videoId: 'bbb22222222',
    artist: 'Artist B',
  },
];

describe('SongsPage', () => {
  it('renders the animated waveform in the header', () => {
    const { container } = render(<SongsPage songs={songs} playlistId="PLTEST" />);
    expect(container.querySelectorAll('.wave-bar').length).toBeGreaterThan(0);
  });

  it('renders the song list and count', () => {
    render(<SongsPage songs={songs} playlistId="PLTEST" />);
    expect(screen.getByText('Song One')).toBeInTheDocument();
    expect(screen.getByText('Song Two')).toBeInTheDocument();
    expect(screen.getByText('2 songs')).toBeInTheDocument();
  });

  it('filters songs by search', () => {
    render(<SongsPage songs={songs} playlistId="PLTEST" />);
    fireEvent.change(screen.getByLabelText('Search songs'), { target: { value: 'two' } });
    expect(screen.getByText('Song Two')).toBeInTheDocument();
    expect(screen.queryByText('Song One')).not.toBeInTheDocument();
  });

  it('shows the whole-playlist embed by default', () => {
    render(<SongsPage songs={songs} playlistId="PLTEST" />);
    const iframe = screen.getByTitle('Songs playlist');
    expect(iframe).toHaveAttribute('src', 'https://www.youtube.com/embed/videoseries?list=PLTEST');
  });

  it('switches the embed to the clicked song and shows the now-playing bar', () => {
    render(<SongsPage songs={songs} playlistId="PLTEST" />);
    fireEvent.click(screen.getByRole('button', { name: /play song two/i }));
    expect(screen.getByTitle('Now playing: Song Two')).toBeInTheDocument();
    expect(screen.getByText('Now playing: Song Two')).toBeInTheDocument();
    expect(screen.getByLabelText('Next track')).toBeInTheDocument();
    expect(screen.getByLabelText('Previous track')).toBeInTheDocument();
  });
});
