import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import StoreProvider from "@/components/providers/StoreProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import SchedulerInitializer from "@/components/SchedulerInitializer";
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  title: "AI分身",
  description: "AI分身",
  icons: {
    icon: "/file.svg",
  },
};

// 单独导出viewport配置
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' className='h-full'>
      <body className="antialiased min-h-[100dvh] overflow-x-hidden">
        <SchedulerInitializer />
        <StoreProvider>
          <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
            {children}
            <Analytics />
            <Toaster />
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
