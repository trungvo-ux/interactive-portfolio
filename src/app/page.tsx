import { Intro } from "@/components/Intro";
import { CaseStudyGrid } from "@/components/CaseStudyGrid";
import { FooterDitherFlame } from "@/components/FooterDitherFlame";

export default function Home() {
  return (
    <>
      <main className="mx-auto flex min-h-screen w-full max-w-[980px] flex-col items-center gap-[93px] px-6 pb-[120px] pt-[120px]">
        <Intro />
        <CaseStudyGrid />
      </main>
      <FooterDitherFlame />
    </>
  );
}
