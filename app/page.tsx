import { MobileEditorialHome } from "@/components/home/MobileEditorialHome";

/** Yeni haberler deploy sonrası en geç 1 saatte ana sayfaya yansır */
export const revalidate = 3600;

export default function HomePage() {
  return <MobileEditorialHome />;
}
