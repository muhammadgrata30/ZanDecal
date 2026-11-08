import {StudioDirections} from "./preview";
export const metadata={title:"ZAN — Five Interactive Studio Directions"};
export default async function Page({searchParams}:{searchParams:Promise<{option?:string}>}){
 const value=Number((await searchParams).option);
 return <StudioDirections initialOption={Number.isInteger(value)&&value>=1&&value<=5?value:1}/>;
}
