// 导入NextAuth模块
import NextAuth from 'next-auth';
// 导入auth.config文件
import { authConfig } from './auth.config';
// 导入Credentials模块，用于处理用户登录
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { User } from './app/lib/definitions';
import postgres from 'postgres'
import bcrypt from 'bcrypt';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
// 异步函数，根据邮箱获取用户信息
async function getUser(email: string): Promise<User | undefined> {
  try {
    // 从数据库中查询用户信息
    const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
    // 返回查询到的用户信息
    return user[0];
  } catch (error) {
    // 捕获错误并打印错误信息
    console.error('Failed to fetch user:', error);
    // 抛出错误
    throw new Error('Failed to fetch user.');
  }
}

// 导出NextAuth实例，包括auth、signIn、signOut方法
export const { auth, signIn, signOut } = NextAuth({
  // 将auth.config文件中的配置项传递给NextAuth实例
  ...authConfig,
  // 在NextAuth实例中添加一个自定义的回调函数，用于处理用户登录后的逻辑
  providers: [
    Credentials({      /**
       * 异步授权函数
       * 该函数用于验证用户凭据并返回用户信息如果验证成功
       * 
       * @param credentials 用户凭据，包含电子邮件和密码
       * @returns 返回用户信息如果验证成功，否则返回null
       */
      async authorize(credentials) {
        // 使用zod库解析和验证凭据格式
        const pd = z
          .object({ email: z.string().email(), password: z.string() })
          .safeParse(credentials);
        // 如果凭据验证成功
        if (pd.success) {
          const {email,password} = pd.data;
          // 尝试根据电子邮件获取用户信息
          const user =await getUser(email)
          // 如果用户不存在，返回null
          if (!user) return null
          // 使用bcrypt库比较密码
          const pw = await bcrypt.compare(password, user.password);
          // 如果密码匹配，返回用户信息
          if (pw) return user;
        }
        // 如果授权失败，打印错误日志并返回null
        console.log('Failed to authorize user:', pd.error);
        return null;
      }
      
    })
  ]
});