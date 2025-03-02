import type { NextAuthConfig } from 'next-auth';

// 导出NextAuth配置
export const authConfig = {
    // 设置登录页面
    pages: {
        signIn: '/login',
    },
    // 设置提供者
    providers: [],
    // 设置回调函数
    callbacks: {
        // 设置授权函数
        authorized({auth, request:{nextUrl}}) {
            // 判断用户是否已登录
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
            if (isOnDashboard) {
                return isLoggedIn;
            } else if(isLoggedIn){
                return Response.redirect(new URL('/dashboard', nextUrl));
            }
            return true
        }
        
    },



} satisfies NextAuthConfig;