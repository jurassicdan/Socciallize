import CstmNav from "@/components/layout/navbar";
import "./globals.css";
import DisplayConfig from "@/components/layout/min-height";
import { ViewTransitions } from "next-view-transitions";

export const metadata = {
  title: "Socciallize",
  description: "Converse com o mundo!",
};

export default function RootLayout({ children }) {
  return (
    <ViewTransitions>
      <html lang="pt-br" data-scroll-behavior="smooth">
        <body>
          <CstmNav />

          <DisplayConfig className="min-height">{children}</DisplayConfig>
        </body>
      </html>
    </ViewTransitions>
  );
}
