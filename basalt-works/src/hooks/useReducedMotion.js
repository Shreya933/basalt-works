import { useMemo } from 'react';
import { prefersReducedMotion } from '../lib/progress';

export const useReducedMotion = () => useMemo(prefersReducedMotion, []);
