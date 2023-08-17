import SettingsForm from "@/components/SettingsForm";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation";

interface SettingPageProps{
  params:{
    storeId: string;
  }
}

export default async function page({params} : SettingPageProps) {
  const {userId} = auth();

  if(!userId){
    redirect('/sign-in');
  }

  const store = await prismadb.store.findFirst({
    where:{
      id: params.storeId,
      userId
    }
  })

  if(!store){
    redirect('/');
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm initialData={store}/>
      </div>
    </div>
  )
}
