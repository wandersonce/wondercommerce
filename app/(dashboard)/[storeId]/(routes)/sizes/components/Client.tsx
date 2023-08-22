"use client"

import Heading from "@/components/ui/Heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { SizesColumn, columns } from "./Columns";
import { DataTable } from "@/components/ui/DataTable";
import ApiList from "@/components/ui/ApiList";

interface SizesClientProps{
  data: SizesColumn[];
}

export default function Client({data} : SizesClientProps) {
  const router = useRouter();
  const params = useParams();
  return (
    <>
    <div className="flex items-center justify-center">
      <Heading title={`Sizes (${data.length})`} description="Manage Sizes for your store."/>

      <Button onClick={() => router.push(`/${params.storeId}/sizes/new`)}>
        <Plus className="mr-2 h-4 w-4"/>
        Add New
      </Button>
    </div>
    <Separator />
    <DataTable columns={columns} data={data} searchKey="name" />
    <Heading title="API" description="API calls for Sizes" />
    <Separator />
    <ApiList entityName="sizes" entityIdName="sizeID" />
    </>
  )
}
