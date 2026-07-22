import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import ProblemCard from '../ProblemCard';

describe('ProblemCard Component', () => {
  const mockProblem = {
    _id: '123',
    title: 'Two Sum',
    difficulty: 'EASY',
    tags: ['Array', 'Hash Table']
  };

  it('renders problem title and difficulty correctly', () => {
    render(
      <BrowserRouter>
        <ProblemCard problem={mockProblem} />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Two Sum')).toBeInTheDocument();
    expect(screen.getByText('EASY')).toBeInTheDocument();
  });

  it('renders tags correctly', () => {
    render(
      <BrowserRouter>
        <ProblemCard problem={mockProblem} />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Array')).toBeInTheDocument();
    expect(screen.getByText('Hash Table')).toBeInTheDocument();
  });

  it('contains a link to the problem detail page', () => {
    render(
      <BrowserRouter>
        <ProblemCard problem={mockProblem} />
      </BrowserRouter>
    );
    
    const linkElement = screen.getByRole('link');
    expect(linkElement).toHaveAttribute('href', '/problems/123');
  });
});
