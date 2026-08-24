import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { YojanaMitraLogo } from '../../src/components/YojanaMitraLogo';

describe('YojanaMitraLogo Component', () => {
  it('renders logo text correctly', () => {
    render(<YojanaMitraLogo size="md" showSubtext={true} />);
    expect(screen.getByText('Yojana Mithra')).toBeInTheDocument();
    expect(screen.getByText('AI • GOVERNMENT SCHEMES')).toBeInTheDocument();
  });

  it('renders icon only when iconOnly prop is true', () => {
    render(<YojanaMitraLogo iconOnly={true} />);
    expect(screen.queryByText('Yojana Mithra')).not.toBeInTheDocument();
  });
});
