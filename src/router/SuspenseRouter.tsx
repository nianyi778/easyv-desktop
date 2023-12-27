import React, { Suspense } from 'react';
import EasyvLoading from '@/components/LoadingAnimation';

function CustomLoading() {
  return <EasyvLoading />;
}

export default function SuspenseRouter({ children }: { children: React.ReactNode }) {
  return children ? <Suspense fallback={<CustomLoading />}>{children}</Suspense> : null;
}

