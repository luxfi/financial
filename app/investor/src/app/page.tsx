import { redirect } from 'next/navigation';

// Root entry. Middleware will short-circuit to /signin if the user has no
// session; if they're authed they land on the dashboard.
export default function Index() {
  redirect('/dashboard');
}
