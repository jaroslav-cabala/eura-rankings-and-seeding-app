import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/rankings')({
  component: () => <div>Hello /rankings!</div>
})