import { Container } from "@/components/layout/Container";

export default function AdminPage() {
  return (
    <Container className="py-10 sm:py-14">
      <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Yönetim</h1>
      <p className="mt-4 max-w-2xl text-slate-600">
        Site statik olarak yayınlanıyor; sunucu tarafı ve API uçları kullanılmıyor. AI ile içerik üretimi gibi özellikler yalnızca yerel
        geliştirme ortamında veya ayrı bir backend ile mümkündür.
      </p>
    </Container>
  );
}
