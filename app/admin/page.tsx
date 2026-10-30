import type { Metadata } from "next";
import { cookies } from "next/headers";
import { AdminWorkspace } from "../../components/admin/AdminWorkspace";
import { getAdminSession } from "../../lib/admin-auth";
import "./admin.css";
export const metadata:Metadata={title:"Admin / Zan Decal",robots:{index:false,follow:false}};
export default async function Page(){
  const cookieStore=await cookies();
  const initialSession=await getAdminSession(cookieStore.toString());
  return <AdminWorkspace initialSession={initialSession}/>;
}
