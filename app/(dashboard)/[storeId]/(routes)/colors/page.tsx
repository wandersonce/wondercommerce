import prismadb from "@/lib/prismadb";
import Client from "./components/Client";
import {format} from 'date-fns';
import {  ColorsColumn } from "./components/Columns";


export default async function Colors({params} : {params : {storeId : string}}) {
  const colors = await prismadb.color.findMany({
    where:{
      storeId: params.storeId
    },
    orderBy:{
      createdAt: 'desc'
    }
  })

  const formattedColors: ColorsColumn[] = colors.map((item)=> ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, 'MMMM do, yyyy')
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Client data={formattedColors} />
      </div>
    </div>
  )
}
