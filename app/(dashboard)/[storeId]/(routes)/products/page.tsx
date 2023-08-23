import prismadb from "@/lib/prismadb";
import Client from "./components/Client";
import {format} from 'date-fns';
import { ProductColumn } from "./components/Columns";
import { formatter } from "@/lib/utils";


export default async function Products({params} : {params : {storeId : string}}) {
  const products = await prismadb.product.findMany({
    where:{
      storeId: params.storeId
    },
    include:{
      category:true,
      size: true,
      color: true,
    },
    orderBy:{
      createdAt: 'desc'
    }
  })

  const formattedProducts: ProductColumn[] = products.map((item)=> ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: formatter.format(item.price.toNumber()),
    category: item.category.name,
    size: item.size.name,
    color:item.color.value,
    createdAt: format(item.createdAt, 'MMMM do, yyyy')
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Client data={formattedProducts} />
      </div>
    </div>
  )
}
