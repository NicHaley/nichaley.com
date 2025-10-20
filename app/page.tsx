import Page from "@/components/page";
import { Stats } from "./stats";

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
        engineer at Ada and Upfront, and led frontend development at Local
        Logic.
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
