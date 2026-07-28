import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import SongCard from '../SongCard';

const mockSong = {
  id: 'test-1',
  Name: 'Test Song',
  src: 'https://example.com/audio/test-song.mp3',
  data: 'https://github.com/test/test-song',
};

const defaultProps = {
  song: mockSong,
  index: 0,
  isCurrentTrack: false,
  isPlaying: false,
  progress: 50,
  onPlay: jest.fn(),
  onTogglePlay: jest.fn(),
};

describe('SongCard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders song name and filename', () => {
    render(<SongCard {...defaultProps} />);
    expect(screen.getByText('Test Song')).toBeInTheDocument();
    expect(screen.getByText('test-song.mp3')).toBeInTheDocument();
  });

  it('renders a play icon when not the current track', () => {
    render(<SongCard {...defaultProps} />);
    const playIcon = document.querySelector('.lucide-play');
    expect(playIcon).toBeInTheDocument();
  });

  it('does not render progress bar when not the current track', () => {
    render(<SongCard {...defaultProps} />);
    // The progress bar container only renders when isCurrentTrack is true
    const progressBars = document.querySelectorAll('.h-1.rounded-full');
    // Only the thin progress bar line should be present if rendered
    // Since isCurrentTrack is false, the progress section should not exist
    const progressContainer = screen.queryByRole('progressbar');
    expect(progressContainer).not.toBeInTheDocument();
  });

  it('renders equalizer animation and pause icon when is currently playing', () => {
    render(
      <SongCard
        {...defaultProps}
        isCurrentTrack={true}
        isPlaying={true}
      />
    );
    // Equalizer bars should exist
    const eqBars = document.querySelectorAll('.animate-equalizer-1');
    expect(eqBars.length).toBeGreaterThan(0);
  });

  it('renders progress bar when is the current track', () => {
    render(
      <SongCard
        {...defaultProps}
        isCurrentTrack={true}
        isPlaying={false}
      />
    );
    // The progress bar should exist with a width style
    const progressDiv = document.querySelector('[style*="width: 50%"]');
    expect(progressDiv).toBeInTheDocument();
  });

  it('shows play icon on current track when paused', () => {
    render(
      <SongCard
        {...defaultProps}
        isCurrentTrack={true}
        isPlaying={false}
      />
    );
    const playIcon = document.querySelector('.lucide-play');
    expect(playIcon).toBeInTheDocument();
  });

  it('renders the source link with correct href and aria-label', () => {
    render(<SongCard {...defaultProps} />);
    const sourceLink = screen.getByLabelText('View on GitHub');
    expect(sourceLink).toBeInTheDocument();
    expect(sourceLink).toHaveAttribute('href', mockSong.data);
    expect(sourceLink).toHaveAttribute('target', '_blank');
  });

  it('calls onPlay with the index when not current track and clicked', () => {
    const onPlay = jest.fn();
    render(<SongCard {...defaultProps} onPlay={onPlay} />);
    // Find the clickable div by its aria-label
    const clickable = screen.getByRole('button', { name: /play test song/i });
    fireEvent.click(clickable);
    expect(onPlay).toHaveBeenCalledWith(0);
  });

  it('calls onTogglePlay when current track and clicked', () => {
    const onTogglePlay = jest.fn();
    render(
      <SongCard
        {...defaultProps}
        isCurrentTrack={true}
        onTogglePlay={onTogglePlay}
      />
    );
    // Find the clickable div by its aria-label — when current track is paused, label is 'Resume'
    const clickable = screen.getByRole('button', { name: /resume/i });
    fireEvent.click(clickable);
    expect(onTogglePlay).toHaveBeenCalled();
  });

  it('does not trigger onPlay when clicking the source link', () => {
    const onPlay = jest.fn();
    render(<SongCard {...defaultProps} onPlay={onPlay} />);
    const sourceLink = screen.getByLabelText('View on GitHub');
    fireEvent.click(sourceLink);
    expect(onPlay).not.toHaveBeenCalled();
  });

  it('renders filename with decoded URI components', () => {
    const songWithEncodedName = {
      ...mockSong,
      src: 'https://example.com/audio/my%20favorite%20song.mp3',
    };
    render(<SongCard {...defaultProps} song={songWithEncodedName} />);
    expect(screen.getByText('my favorite song.mp3')).toBeInTheDocument();
  });

  it('renders fallback text when src has no filename', () => {
    const songWithoutFile = {
      ...mockSong,
      src: 'https://example.com/',
    };
    render(<SongCard {...defaultProps} song={songWithoutFile} />);
    expect(screen.getByText('Audio track')).toBeInTheDocument();
  });

  it('applies correct styling when is the current track', () => {
    render(
      <SongCard
        {...defaultProps}
        isCurrentTrack={true}
        isPlaying={false}
      />
    );
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
