import prismadb from "@/lib/prismadb";
import Client from "./components/Client";
import {format} from 'date-fns';
import { BillboardColumn } from "./components/Columns";


export default async function Billboards({params} : {params : {storeId : string}}) {
  const billboards = await prismadb.billboard.findMany({
    where:{
      storeId: params.storeId
    },
    orderBy:{
      createdAt: 'desc'
    }
  })

  const formattedBuillboards: BillboardColumn[] = billboards.map((item)=> ({
    id: item.id,
    label: item.label,
    createdAt: format(item.createdAt, 'MMMM do, yyyy')
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Client data={formattedBuillboards} />
      </div>
    </div>
  )
}
