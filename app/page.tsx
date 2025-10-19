import Page from "@/components/page";
import { Stats } from "./stats";

export default function Home() {
  return (
    <Page
      title="Nic Haley"
      // description="0 → 1 Product Engineer"
      // description="Developer and Designer"
    >
      <p className="mb-10">
        I&apos;m Nic — a product engineer based in Montreal 🥯 As an urbanist, I
        love exploring the roles of technology and cycling in making our cities
        greener and better places to live. Find me on{" "}
        <a href="https://github.com/nichaley">GitHub</a> or{" "}
        <a href="https://www.linkedin.com/in/nicholas-haley-22757389/">
          LinkedIn
        </a>
        , or reach out to me at{" "}
        <a href="mailto:hello@nichaley.com">hello@nichaley.com</a>.
      </p>
      <Stats />
    </Page>
  );
}
