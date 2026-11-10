import type { Metadata } from "next";

import { AdminWorkspace } from "../../components/admin/AdminWorkspace";

import "./admin.css";
export const metadata:Metadata={title:"Admin / Zan Decal",robots:{index:false,follow:false}};
export default async function Page(){
  return <AdminWorkspace initialSession={{setupRequired:false,username:null}}/>;
}
