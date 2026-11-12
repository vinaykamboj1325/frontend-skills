import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Card } from './Card';

describe('Card', () => {
  it('renders the title as a heading', () => {
    render(<Card title="Details">Body</Card>);
    expect(screen.getByRole('heading', { name: 'Details' })).toBeInTheDocument();
  });

  it('renders children', () => {
    render(<Card>Body</Card>);
    expect(screen.getByText('Body')).toBeInTheDocument();
  });
});
