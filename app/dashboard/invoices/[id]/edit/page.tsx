import Form from '@/app/ui/invoices/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchInvoiceById, fetchCustomers } from '@/app/lib/data';
import { notFound } from 'next/navigation';
//  type PageParams = {
//   params : { id: string }
//  }
export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params; // 等待 params 解析
  if (!params || !params.id) {
    return <p>Loading...</p>; // 处理未解析的 params
  }

  const id = params.id; // ✅ 确保 params 已经解析
  console.log("Invoice ID:", id);

  try {
    const [invoice, customers] = await Promise.all([
      fetchInvoiceById(id),
      fetchCustomers(),
    ]);
    if (!invoice) {
      notFound();
    }
    return (
      <main>
        <Breadcrumbs
          breadcrumbs={[
            { label: "Invoices", href: "/dashboard/invoices" },
            {
              label: "Edit Invoice",
              href: `/dashboard/invoices/${id}/edit`,
              active: true,
            },
          ]}
        />
        <Form invoice={invoice} customers={customers} />
      </main>
    );
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return <p>Error loading invoice</p>;
  }
}
