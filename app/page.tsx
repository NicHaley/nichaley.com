import Image from "next/image";

export default function Home() {
  return (
    <div className="prose prose-lg mx-auto px-4 py-16">
      <Image src="/glasses.webp" alt="logo" width={100} height={100} />
      <h1 className="text-3xl font-bold">Nic Haley</h1>
      <p>
        I&apos;m Nic — a product engineer based in Montreal 🥯 I&apos;m an
        urbanist, and love exploring the roles of technology and cycling in
        making our cities greener and better places to live. Find me on{" "}
        <a href="https://github.com/nichaley">GitHub</a> or{" "}
        <a href="https://www.linkedin.com/in/nicholas-haley-22757389/">
          LinkedIn
        </a>
        , or reach out to me at{" "}
        <a href="mailto:hello@nichaley.com">hello@nichaley.com</a>.
      </p>
    </div>
  );
}
