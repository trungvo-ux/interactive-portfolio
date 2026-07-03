import { Passport } from "@/components/passport/Passport";

export function Intro() {
  return (
    <section className="flex w-full flex-col items-center gap-[48px] md:flex-row md:items-center md:justify-between md:gap-[93px]">
      <div className="t-stagger flex flex-1 flex-col items-start gap-[17px]">
        <h1
          className="text-[36px] font-medium leading-[1.05] tracking-[-1.08px] text-black"
          style={{ ["--i" as string]: 0 }}
        >
          Trung Vo
        </h1>
        <p
          className="max-w-[460px] text-[16px] leading-[1.5] tracking-[-0.48px] text-muted"
          style={{ ["--i" as string]: 1 }}
        >
          I was born in the Bay Area and now work in San Jose, CA.
        </p>
        <p
          className="max-w-[460px] text-[16px] leading-[1.5] tracking-[-0.48px] text-muted"
          style={{ ["--i" as string]: 1 }}
        >
          I previously worked at a couple of startups that helped build my foundation and interest in design.
        </p>
        <p
          className="max-w-[460px] text-[16px] leading-[1.5] tracking-[-0.48px] text-muted"
          style={{ ["--i" as string]: 2 }}
        >
          I&rsquo;m currently at IBM on watsonx.data, where we&rsquo;re enhancing agentic AI experiences for both clients and agents.
        </p>
      </div>

      <div
        className="t-stagger flex justify-center"
        style={{ ["--i" as string]: 2 }}
      >
        <div style={{ ["--i" as string]: 3 }}>
          <Passport />
        </div>
      </div>
    </section>
  );
}
