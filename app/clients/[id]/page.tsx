import {ClientDetail} from '@/features/clients/client-detail';
export default async function Page({params}:{params:Promise<{id:string}>}){const{id}=await params;return <ClientDetail id={id}/>}
