import { Metadata } from "next";
import { notFound } from "next/navigation";
import { serverUnifiedHairstyleService } from "@/lib/api/services/server";
import { HairstyleDetail } from "@/features/storefront/components/hairstyle/hairstyle-detail";

interface HairstylePageProps {
  params: Promise<{
    hairstyleId: string;
  }>;
}

export async function generateMetadata({
  params,
}: HairstylePageProps): Promise<Metadata> {
  const { hairstyleId } = await params;

  try {
    const hairstyle = await serverUnifiedHairstyleService.getHairstyle(
      parseInt(hairstyleId)
    );

    return {
      title: hairstyle.name,
      description:
        hairstyle.name || `View this hairstyle by ${hairstyle.barberName}`,
    };
  } catch {
    return {
      title: "Hairstyle Not Found",
    };
  }
}

export default async function HairstylePage({ params }: HairstylePageProps) {
  const { hairstyleId } = await params;

  try {
    const hairstyle = await serverUnifiedHairstyleService.getHairstyle(
      parseInt(hairstyleId)
    );

    return <HairstyleDetail hairstyle={hairstyle} />;
  } catch {
    notFound();
  }
}
