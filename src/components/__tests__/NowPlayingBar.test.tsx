import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import NowPlayingBar from '../NowPlayingBar';

const mockSong = {
  Name: 'Test Song',
  data: 'https://github.com/test/test-song',
};

const createMockRef = () =>
  ({ current: null } as React.RefObject<HTMLDivElement>);

const createAudioRef = () =>
  ({ current: null } as React.RefObject<HTMLAudioElement>);

const defaultProps = {
  currentSong: mockSong,
  isPlaying: false,
  currentTime: 60,
  duration: 200,
  volume: 0.7,
  isMuted: false,
  progress: 30,
  progressRef: createMockRef(),
  audioRef: createAudioRef(),
  onProgressClick: jest.fn(),
  onTogglePlay: jest.fn(),
  onNext: jest.fn(),
  onPrev: jest.fn(),
  onToggleMute: jest.fn(),
  onVolumeChange: jest.fn(),
};

describe('NowPlayingBar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the song name', () => {
    render(<NowPlayingBar {...defaultProps} />);
    expect(screen.getByText('Test Song')).toBeInTheDocument();
  });

  it('renders formatted current time and duration', () => {
    render(<NowPlayingBar {...defaultProps} currentTime={60} duration={200} />);
    expect(screen.getByText('1:00 / 3:20')).toBeInTheDocument();
  });

  it('formats time correctly for various values', () => {
    const { rerender } = render(
      <NowPlayingBar {...defaultProps} currentTime={0} duration={0} />
    );
    expect(screen.getByText('0:00 / 0:00')).toBeInTheDocument();

    rerender(
      <NowPlayingBar {...defaultProps} currentTime={125} duration={3661} />
    );
    expect(screen.getByText('2:05 / 61:01')).toBeInTheDocument();
  });

  it('renders music icon when not playing', () => {
    render(<NowPlayingBar {...defaultProps} isPlaying={false} />);
    const musicIcon = document.querySelector('.lucide-music');
    expect(musicIcon).toBeInTheDocument();
  });

  it('renders equalizer bars when playing', () => {
    render(<NowPlayingBar {...defaultProps} isPlaying={true} />);
    const eqBars = document.querySelectorAll('.animate-equalizer-1');
    expect(eqBars.length).toBeGreaterThan(0);
  });

  it('shows Play button with correct aria-label when paused', () => {
    render(<NowPlayingBar {...defaultProps} isPlaying={false} />);
    const playBtn = screen.getByLabelText('Play');
    expect(playBtn).toBeInTheDocument();
    const playIcon = document.querySelector('.lucide-play');
    expect(playIcon).toBeInTheDocument();
  });

  it('shows Pause button with correct aria-label when playing', () => {
    render(<NowPlayingBar {...defaultProps} isPlaying={true} />);
    const pauseBtn = screen.getByLabelText('Pause');
    expect(pauseBtn).toBeInTheDocument();
    const pauseIcon = document.querySelector('.lucide-pause');
    expect(pauseIcon).toBeInTheDocument();
  });

  it('calls onTogglePlay when play/pause button clicked', () => {
    const onTogglePlay = jest.fn();
    render(
      <NowPlayingBar {...defaultProps} onTogglePlay={onTogglePlay} />
    );
    const playBtn = screen.getByLabelText('Play');
    fireEvent.click(playBtn);
    expect(onTogglePlay).toHaveBeenCalled();
  });

  it('calls onNext when next button clicked', () => {
    const onNext = jest.fn();
    render(<NowPlayingBar {...defaultProps} onNext={onNext} />);
    const nextBtn = screen.getByLabelText('Next track');
    fireEvent.click(nextBtn);
    expect(onNext).toHaveBeenCalled();
  });

  it('calls onPrev when previous button clicked', () => {
    const onPrev = jest.fn();
    render(<NowPlayingBar {...defaultProps} onPrev={onPrev} />);
    const prevBtn = screen.getByLabelText('Previous track');
    fireEvent.click(prevBtn);
    expect(onPrev).toHaveBeenCalled();
  });

  it('renders volume controls', () => {
    render(<NowPlayingBar {...defaultProps} />);
    const volumeSlider = screen.getByTitle('Volume');
    expect(volumeSlider).toBeInTheDocument();
    expect(volumeSlider).toHaveAttribute('type', 'range');
    expect(volumeSlider).toHaveValue('0.7');
  });

  it('calls onVolumeChange when volume slider changes', () => {
    const onVolumeChange = jest.fn();
    render(
      <NowPlayingBar {...defaultProps} onVolumeChange={onVolumeChange} />
    );
    const volumeSlider = screen.getByTitle('Volume');
    fireEvent.change(volumeSlider, { target: { value: '0.5' } });
    expect(onVolumeChange).toHaveBeenCalled();
  });

  it('shows volume icon when unmuted', () => {
    render(
      <NowPlayingBar {...defaultProps} isMuted={false} volume={0.7} />
    );
    // When unmuted, the mute button should show 'Mute' label
    const muteBtn = screen.getByLabelText('Mute');
    expect(muteBtn).toBeInTheDocument();
  });

  it('shows muted icon when muted', () => {
    render(
      <NowPlayingBar {...defaultProps} isMuted={true} />
    );
    const muteBtn = screen.getByLabelText('Unmute');
    expect(muteBtn).toBeInTheDocument();
  });

  it('shows muted icon when volume is zero', () => {
    render(
      <NowPlayingBar {...defaultProps} isMuted={false} volume={0} />
    );
    // When volume is 0 but not muted, label still shows 'Mute'
    const muteBtn = screen.getByLabelText('Mute');
    expect(muteBtn).toBeInTheDocument();
  });

  it('calls onToggleMute when mute button clicked', () => {
    const onToggleMute = jest.fn();
    render(
      <NowPlayingBar {...defaultProps} onToggleMute={onToggleMute} />
    );
    const muteBtn = screen.getByLabelText('Mute');
    fireEvent.click(muteBtn);
    expect(onToggleMute).toHaveBeenCalled();
  });

  it('renders unmute label when muted', () => {
    render(<NowPlayingBar {...defaultProps} isMuted={true} />);
    expect(screen.getByLabelText('Unmute')).toBeInTheDocument();
  });

  it('renders the source link with correct href', () => {
    render(<NowPlayingBar {...defaultProps} />);
    const sourceLink = screen.getByText('Source');
    expect(sourceLink).toBeInTheDocument();
    expect(sourceLink).toHaveAttribute('href', mockSong.data);
  });

  it('renders seek bar with slider role and aria attributes', () => {
    render(
      <NowPlayingBar {...defaultProps} currentTime={60} duration={200} />
    );
    const seekBar = screen.getByRole('slider', { name: 'Seek' });
    expect(seekBar).toBeInTheDocument();
    expect(seekBar).toHaveAttribute('aria-valuemin', '0');
    expect(seekBar).toHaveAttribute('aria-valuemax', '200');
    expect(seekBar).toHaveAttribute('aria-valuenow', '60');
    expect(seekBar).toHaveAttribute('tabindex', '0');
  });

  it('calls onProgressClick when seek bar is clicked', () => {
    const onProgressClick = jest.fn();
    const ref = { current: document.createElement('div') } as React.RefObject<HTMLDivElement>;
    render(
      <NowPlayingBar
        {...defaultProps}
        progressRef={ref}
        onProgressClick={onProgressClick}
      />
    );
    const seekBar = screen.getByRole('slider', { name: 'Seek' });
    fireEvent.click(seekBar);
    expect(onProgressClick).toHaveBeenCalled();
  });

  it('progress bar has correct width style', () => {
    render(<NowPlayingBar {...defaultProps} progress={30} />);
    const progressFill = document.querySelector('[style*="width: 30%"]');
    expect(progressFill).toBeInTheDocument();
  });

  it('handles seek bar arrow key right when audio ref exists', () => {
    const audio = document.createElement('audio');
    audio.currentTime = 50;
    const audioRef = { current: audio } as React.RefObject<HTMLAudioElement>;
    render(
      <NowPlayingBar
        {...defaultProps}
        audioRef={audioRef}
        duration={200}
      />
    );
    const seekBar = screen.getByRole('slider', { name: 'Seek' });
    fireEvent.keyDown(seekBar, { key: 'ArrowRight' });
    expect(audio.currentTime).toBe(55);
  });

  it('handles seek bar arrow key left when audio ref exists', () => {
    const audio = document.createElement('audio');
    audio.currentTime = 50;
    const audioRef = { current: audio } as React.RefObject<HTMLAudioElement>;
    render(
      <NowPlayingBar
        {...defaultProps}
        audioRef={audioRef}
        duration={200}
      />
    );
    const seekBar = screen.getByRole('slider', { name: 'Seek' });
    fireEvent.keyDown(seekBar, { key: 'ArrowLeft' });
    expect(audio.currentTime).toBe(45);
  });

  it('does not crash when audio ref is null during seek', () => {
    render(<NowPlayingBar {...defaultProps} audioRef={{ current: null }} />);
    const seekBar = screen.getByRole('slider', { name: 'Seek' });
    expect(() => {
      fireEvent.keyDown(seekBar, { key: 'ArrowRight' });
    }).not.toThrow();
  });
});
