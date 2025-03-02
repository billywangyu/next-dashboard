// 导入NextAuth模块
import NextAuth from 'next-auth';
// 导入authConfig配置文件
import { authConfig } from './auth.config';
 //
// 导出NextAuth实例
export default NextAuth(authConfig).auth;
 
// 导出配置文件
export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  // 匹配器，用于匹配路由
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};