
// 引入全局样式表
import '@/app/ui/global.css';
// 引入字体
import { inter } from '@/app/ui/fonts';
// 引入Metadata类型
import { Metadata } from 'next';


// 定义metadata
export const metadata: Metadata = {
  // 页面标题
  title: {
    template: '%s | Acme Dashboard',
    default: 'Acme Dashboard'
  },
  // 页面描述
  description: 'The official Next.js Course Dashboard, built with App Router.',
  // 页面关键词
  keywords: ['next.js', 'app router', 'dashboard', 'admin', 'template'],
  // openGraph配置
  openGraph: {
    // openGraph标题
    title: 'Acme Dashboard',
    // openGraph描述
    description: 'The official Next.js Course Dashboard, built with App Router.',
    // openGraph链接
    url: 'https://next-learn-dashboard.vercel.sh',
    // openGraph站点名称
    siteName: 'Acme Dashboard',
    // openGraph图片
    images: [
      {
        // 图片链接
        url: 'https://next-learn-dashboard.vercel.sh/og.png',
        // 图片宽度
        width: 1200,
        height: 630,
        alt: 'Acme Dashboard',
        // 图片描述
      },
    ],
  },
  metadataBase: new URL('https://next-learn-dashboard.vercel.sh'),
  // metadataBase配置
};

export default function RootLayout({
  // 定义根布局组件
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
    {/*定义html标签*/}
      <body className={`${inter.className} antialissed`}>{children}</body>
       {/*定义body标签，并添加字体和抗锯齿样式*/}
    </html>
  );
}
