import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import SongCard from '../SongCard';

const mockSong = {
  id: 1,
  Name: 'Test Song',
  src: 'https://www.youtube.com/watch?v=abc123',
  data: 'https://www.youtube.com/watch?v=abc123',
  artist: 'Test Artist',
  thumb: 'https://i.ytimg.com/vi/abc123/hqdefault.jpg',
};

const defaultProps = {
  song: mockSong,
  index: 0,
  isCurrent: false,
  onPlay: jest.fn(),
};

describe('SongCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders song name and artist', () => {
    render(<SongCard {...defaultProps} />);
    expect(screen.getByText('Test Song')).toBeInTheDocument();
    expect(screen.getByText('Test Artist')).toBeInTheDocument();
  });

  it('renders fallback text when artist is missing', () => {
    render(<SongCard {...defaultProps} song={{ ...mockSong, artist: undefined }} />);
    expect(screen.getByText('YouTube')).toBeInTheDocument();
  });

  it('renders a play icon when not the current track', () => {
    render(<SongCard {...defaultProps} />);
    const playIcon = document.querySelector('.lucide-play');
    expect(playIcon).toBeInTheDocument();
  });

  it('renders equalizer animation when is the current track', () => {
    render(<SongCard {...defaultProps} isCurrent={true} />);
    const eqBars = document.querySelectorAll('.animate-equalizer-1');
    expect(eqBars.length).toBeGreaterThan(0);
  });

  it('renders the thumbnail image when available', () => {
    render(<SongCard {...defaultProps} />);
    const img = document.querySelector('img');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', mockSong.thumb);
  });

  it('renders the source link with correct href and aria-label', () => {
    render(<SongCard {...defaultProps} />);
    const sourceLink = screen.getByLabelText('Watch on YouTube');
    expect(sourceLink).toBeInTheDocument();
    expect(sourceLink).toHaveAttribute('href', mockSong.data);
    expect(sourceLink).toHaveAttribute('target', '_blank');
  });

  it('calls onPlay with the index when clicked', () => {
    const onPlay = jest.fn();
    render(<SongCard {...defaultProps} onPlay={onPlay} />);
    const clickable = screen.getByRole('button', { name: /play test song/i });
    fireEvent.click(clickable);
    expect(onPlay).toHaveBeenCalledWith(0);
  });

  it('calls onPlay with the index when current track is clicked', () => {
    const onPlay = jest.fn();
    render(<SongCard {...defaultProps} isCurrent={true} onPlay={onPlay} />);
    const clickable = screen.getByRole('button', { name: /play test song/i });
    fireEvent.click(clickable);
    expect(onPlay).toHaveBeenCalledWith(0);
  });

  it('does not trigger onPlay when clicking the source link', () => {
    const onPlay = jest.fn();
    render(<SongCard {...defaultProps} onPlay={onPlay} />);
    const sourceLink = screen.getByLabelText('Watch on YouTube');
    fireEvent.click(sourceLink);
    expect(onPlay).not.toHaveBeenCalled();
  });

  it('applies correct styling when is the current track', () => {
    render(<SongCard {...defaultProps} isCurrent={true} />);
    const clickable = screen.getByText('Test Song').closest('[class*="group"]');
    expect(clickable?.className).toContain('bg-rose-500/10');
    expect(clickable?.className).toContain('ring-1');
  });

  it('has correct animation delay style based on index', () => {
    const { container } = render(<SongCard {...defaultProps} index={3} />);
    const outerDiv = container.firstChild as HTMLElement;
    expect(outerDiv.getAttribute('style')).toContain('animation-delay: 300ms');
  });
});
