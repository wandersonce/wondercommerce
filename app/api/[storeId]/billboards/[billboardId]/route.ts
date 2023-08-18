import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"


//UPDATE STORE ROUTE
export async function PATCH(req:Request, {params} : {params : {storeId: string , billboardId : string}}){

  try {
    const {userId} = auth();
    const body = await req.json();

    const {label, imageUrl} = body;
    
    //Checking if the user is logged
    if(!userId){
      return new NextResponse("Unauthorized", {status: 401})
    }

    //checking if we are receiving the Store name from the form
    if(!label){
      return new NextResponse("Label is required.", {status: 400})
    }

    if(!imageUrl){
      return new NextResponse("Image URL is required.", {status: 400})
    }

    if(!params.billboardId){
      return new NextResponse("Billboard ID required.", {status: 400})
    }

    const storeByUserId = await prismadb.store.findFirst({
      where:{
        id: params.storeId,
        userId
      }
    });

    if(!storeByUserId){
      return new NextResponse("Unauthorized", {status: 403})
    }

    const billboard = await prismadb.billboard.updateMany({
      where:{
        id: params.billboardId,
      },
       data: {
        label,
        imageUrl
       }
    })

    return NextResponse.json(billboard)

  } catch (error) {
    console.log('[BILLBOARD_PATCH', error)
    return new NextResponse("Internal error", {status: 500})
  }

}

//DELETE STORE
//Even req is not being used the params only is returned in the second parameter of the function
export async function DELETE(req:Request, {params} : {params : {storeId : string}}){

  try {
    const {userId} = auth();
    
    //Checking if the user is logged
    if(!userId){
      return new NextResponse("Unauthorized", {status: 401})
    }

    if(!params.storeId){
      return new NextResponse("Store ID required.", {status: 400})
    }

    const store = await prismadb.store.deleteMany({
      where:{
        id: params.storeId,
        userId
      }
    })

    return NextResponse.json(store)

  } catch (error) {
    console.log('[STORE_DELETE', error)
    return new NextResponse("Internal error", {status: 500})
  }

}