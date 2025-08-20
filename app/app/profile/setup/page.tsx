
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { redirect } from 'next/navigation';
import { ProfileSetup } from '@/components/profile/profile-setup';

export default async function ProfileSetupPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/auth');
  }

  return <ProfileSetup />;
}
