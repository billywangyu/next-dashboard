'use server';
// 导入zod库，用于表单验证
import { z } from 'zod';
// 导入postgres库，用于数据库操作
import postgres from 'postgres';
// 导入next/cache库，用于缓存
import { revalidatePath } from 'next/cache';
// 导入next/navigation库，用于页面跳转
import { redirect } from 'next/navigation';
// 导入next-auth库，用于用户认证
import { signIn } from '@/auth';
// 导入AuthError，用于处理认证错误
import { AuthError } from 'next-auth';


// 创建一个postgres实例，用于数据库操作
const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// 定义表单验证规则
const FormSchema = z.object({
  id: z.string(),
  customerId: z.string({ invalid_type_error: 'Please select a customer.', }),
  amount: z.coerce.number().gt(0, { message: 'Please enter an amount greater than $0.' }),
  status: z.enum(['pending', 'paid'], {
    invalid_type_error: 'Please select an invoice status.',
  }),
  date: z.string(),
});

// 创建一个表单验证规则，用于创建发票
const CreateInvoice = FormSchema.omit({ id: true, date: true });

// 定义状态类型
export type State = {
  error?: {
    customerId?: string[],
    amount?: string[],
    status?: string[]
  }
  message?: string | undefined 
};

// 创建发票
export async function createInvoice(prevState: State, formData: FormData) {
  // 验证表单数据
  const validatedFilds = CreateInvoice.safeParse({
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  // 如果验证失败，返回错误信息
  if (!validatedFilds.success) {
    return {
      error: validatedFilds.error?.flatten().fieldErrors,
      message: 'Please fix the errors below.',
    };
  }
  // 获取表单数据
  const { customerId, amount, status } = validatedFilds.data;
  // 将金额转换为分
  const amountInCents = amount * 100;
  // 获取当前日期
  const date = new Date().toISOString().split('T')[0];
  try {
    // 插入数据到数据库
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch {
    
    // 如果插入失败，返回错误信息
    return {
      message: 'Database Error: Failed to Create Invoice.',
    };
  }
 
  
  // 刷新缓存，跳转到发票列表页面
  revalidatePath('/dashboard/invoices');
  redirect('/dashboard/invoices');
}

// 更新发票
const UpdateInvoice = FormSchema.omit({ id: true, date: true });
export async function updateInvoice(id: string, formData: FormData) {
  // 获取表单数据
  const { customerId, amount, status } = UpdateInvoice.parse({
    id: formData.get('id'),
    customerId: formData.get('customerId'),
    amount: formData.get('amount'),
    status: formData.get('status'),
  });
  // 将金额转换为分
  const amountInCents = amount * 100;
  await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;
  revalidatePath('/dashboard/invoices');
  // 刷新缓存，跳转到发票列表页面
  redirect('/dashboard/invoices');
}

export async function deleteInvoice(id: string) {
// 删除发票
  await sql`
  // 从数据库中删除数据
    DELETE FROM invoices
    WHERE id = ${id}
  `;
  revalidatePath('/dashboard/invoices');
  // 刷新缓存

}
//登录页相应的action
export async function authenticate(prevState: string | undefined,formData: FormData) {
  try {
    await signIn('credentials',formData );
    // 用户认证
  }
    catch (error) {
     if (error instanceof AuthError) {
     // 处理认证错误
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'An unexpected error occurred.';

      }
     }
     throw error;

  }


}