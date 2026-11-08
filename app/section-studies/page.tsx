import {SectionStudies} from "./preview";
export const metadata={title:"ZAN — 10 Section Motion Mockups"};
export default async function Page({searchParams}:{searchParams:Promise<{set?:string}>}){
 const value=Number((await searchParams).set);
 return <SectionStudies initialPreset={Number.isInteger(value)&&value>=1&&value<=10?value:1}/>;
}
