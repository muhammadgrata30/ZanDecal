import { MotionStudies } from "./preview";
export const metadata = {title:"ZAN — Pressure × Cut / Five Hero Studies"};
export default async function Page({searchParams}:{searchParams:Promise<{option?:string}>}){
  const value=Number((await searchParams).option);
  return <MotionStudies initialOption={Number.isInteger(value)&&value>=1&&value<=5?value:1}/>;
}
