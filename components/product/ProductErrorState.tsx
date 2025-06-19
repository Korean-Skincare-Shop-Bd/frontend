import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ProductErrorStateProps {
  error: string;
}

export function ProductErrorState({ error }: ProductErrorStateProps) {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <h2 className="mb-4 font-bold text-2xl">Error</h2>
        <p className="mb-6 text-muted-foreground">{error || "Failed to load product"}</p>
        <Button asChild>
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    </div>
  );
}