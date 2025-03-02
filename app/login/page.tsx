import AcmeLogo from '@/app/ui/acme-logo'; // 导入AcmeLogo组件
import LoginForm from '@/app/ui/login-form'; // 导入LoginForm组件
import { Suspense } from 'react'; // 导入React的Suspense组件
 
// 导出一个默认的函数组件LoginPage
export default function LoginPage() {
  // 返回一个main标签，包含一个div标签
  return (
    <main className="flex items-center justify-center md:h-screen">
      <div className="relative mx-auto flex w-full max-w-[400px] flex-col space-y-2.5 p-4 md:-mt-32">
        {/*div标签包含一个div标签，用于显示logo*/}
        <div className="flex h-20 w-full items-end rounded-lg bg-blue-500 p-3 md:h-36">
          <div className="w-32 text-white md:w-36">
            <AcmeLogo />
          </div>
        </div>
        
        {/*使用Suspense组件包裹LoginForm组件，实现懒加载*/}
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}