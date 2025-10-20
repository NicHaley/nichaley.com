import Page from "@/components/page";
import { Stats } from "./stats";

export const dynamic = "force-static";
export const revalidate = 3600; // 1 hour

export default function Home() {
  return (
    <Page
      title="Nic Haley"
      // description="0 → 1 Product Engineer"
      // description="Developer and Designer"
    >
      <p>
        I'm a developer and designer based in Montreal [and currently visiting
        X]. I'm currently on paternity leave. Previously, I was a founding
        engineer at{" "}
        <a href="https://ada.cx" target="_blank" rel="noopener">
          Ada
        </a>{" "}
        and{" "}
        <a href="https://myupfront.com" target="_blank" rel="noopener">
          Upfront
        </a>
        , and led frontend development at{" "}
        <a href="https://locallogic.co" target="_blank" rel="noopener">
          Local Logic
        </a>
        .
      </p>
      <p>
        In my work, I explore how design and technology can shape better ways of
        living, especially in our built environment. I also volunteer as a bike
        mechanic and enjoy film and music.
      </p>
      <p className="mb-10">
        Find me on <a href="https://github.com/nichaley">GitHub</a> or{" "}
        <a href="https://www.linkedin.com/in/nicholas-haley-22757389/">
          LinkedIn
        </a>
        , or reach out to me at{" "}
        <a href="mailto:hello@nichaley.com">hello@nichaley.com</a>.
      </p>
      {/* <Stats /> */}
    </Page>
  );
}
