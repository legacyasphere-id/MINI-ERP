import { useParams } from 'react-router-dom';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  return (
    <div>
      <h1 className="text-2xl font-bold">Product Detail</h1>
      <p className="text-muted-foreground">ID: {id}</p>
    </div>
  );
}
