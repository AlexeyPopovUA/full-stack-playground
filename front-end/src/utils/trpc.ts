import { createTRPCReact } from '@trpc/react-query';
import type {AppRouter} from 'trpc-demo/src/app';

export const trpc = createTRPCReact<AppRouter>();
