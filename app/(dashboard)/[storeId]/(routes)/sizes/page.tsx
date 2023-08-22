import prismadb from "@/lib/prismadb";
import Client from "./components/Client";
import {format} from 'date-fns';
import {  SizesColumn } from "./components/Columns";


export default async function Sizes({params} : {params : {storeId : string}}) {
  const sizes = await prismadb.size.findMany({
    where:{
      storeId: params.storeId
    },
    orderBy:{
      createdAt: 'desc'
    }
  })

  const formattedSizes: SizesColumn[] = sizes.map((item)=> ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, 'MMMM do, yyyy')
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Client data={formattedSizes} />
      </div>
    </div>
  )
}
