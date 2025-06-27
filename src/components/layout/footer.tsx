import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0 px-[5%]">
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-2">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built with 💜 by{" "}
            <Link
              href="https://x.com/tonashiro_"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4 hover:text-foreground"
            >
              Tonashiro
            </Link>
            . Powered by Chog.
          </p>
        </div>
      </div>
    </footer>
  );
}
