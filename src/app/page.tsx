import { redirect } from 'next/navigation';

export default function Home() {
  // Redirect to dashboard for now
  // Later: Check if user is authenticated and onboarded
  redirect('/dashboard');
}
