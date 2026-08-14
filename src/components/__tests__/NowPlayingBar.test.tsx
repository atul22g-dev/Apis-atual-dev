import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import NowPlayingBar from '../NowPlayingBar';

const mockSong = {
  Name: 'Test Song',
  data: 'https://www.youtube.com/watch?v=abc123',
};

const defaultProps = {
  currentSong: mockSong,
  onNext: jest.fn(),
  onPrev: jest.fn(),
};

describe('NowPlayingBar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the song name', () => {
    render(<NowPlayingBar {...defaultProps} />);
    expect(screen.getByText('Test Song')).toBeInTheDocument();
  });

  it('renders the playing subtitle', () => {
    render(<NowPlayingBar {...defaultProps} />);
    expect(screen.getByText('Playing on YouTube')).toBeInTheDocument();
  });

  it('renders the music icon in the avatar', () => {
    render(<NowPlayingBar {...defaultProps} />);
    expect(document.querySelector('.lucide-music')).toBeInTheDocument();
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

  it('renders the source link with correct href', () => {
    render(<NowPlayingBar {...defaultProps} />);
    const sourceLink = screen.getByText('Watch on YouTube');
    expect(sourceLink).toBeInTheDocument();
    expect(sourceLink).toHaveAttribute('href', mockSong.data);
    expect(sourceLink).toHaveAttribute('target', '_blank');
  });
});
