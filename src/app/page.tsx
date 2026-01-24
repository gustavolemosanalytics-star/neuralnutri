import { redirect } from 'next/navigation';

export default function Home() {
  // Start with the Anamnese flow
  redirect('/anamnese');
}
