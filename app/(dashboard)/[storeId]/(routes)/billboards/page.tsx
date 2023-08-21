import prismadb from "@/lib/prismadb";
import Client from "./components/Client";


export default async function Billboards({params} : {params : {storeId : string}}) {
  const billboards = await prismadb.billboard.findMany({
    where:{
      storeId: params.storeId
    },
    orderBy:{
      createdAt: 'desc'
    }
  })

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Client data={billboards} />
      </div>
    </div>
  )
}
