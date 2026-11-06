import type { Metadata } from "next";
import { MaterialLab } from "../../components/material-lab/MaterialLab";
import "./material-lab.css";

export const metadata:Metadata={title:"Material Studies / Zan Decal",robots:{index:false,follow:false}};

export default async function MaterialStudies({searchParams}:{searchParams:Promise<{option?:string}>}){
  const query=await searchParams;
  const parsed=Number(query.option);
  const option=Number.isInteger(parsed)&&parsed>=1&&parsed<=5?parsed:1;
  return <MaterialLab key={option} option={option}/>;
}
