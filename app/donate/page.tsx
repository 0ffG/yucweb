import { Suspense } from 'react';
import DonationClient from './DonationClient';

export default function DonatePage() {
  return (
    <Suspense fallback={<div>Yükleniyor...</div>}>
      <DonationClient />
    </Suspense>
  );
}
