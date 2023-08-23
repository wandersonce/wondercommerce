"use client"

import Heading from "@/components/ui/Heading";
import { Separator } from "@/components/ui/separator";
import { OrderColumn, columns } from "./Columns";
import { DataTable } from "@/components/ui/DataTable";

interface OrderClientProps{
  data: OrderColumn[];
}

export default function Client({data} : OrderClientProps) {
  return (
    <>
      <Heading title={`Orders (${data.length})`} description="Manage orders for your store."/>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="products" />
    </>
  )
}
