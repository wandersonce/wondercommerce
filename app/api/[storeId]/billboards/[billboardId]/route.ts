import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

// GET INDIVIDUAL BILLBOARD
export async function GET(req:Request, {params} : {params : { billboardId: string}}){

  try {

    if(!params.billboardId){
      return new NextResponse("Billboard ID required.", {status: 400})
    }

    const billboard = await prismadb.billboard.findUnique({
      where:{
        id: params.billboardId,
      }
    })

    return NextResponse.json(billboard)

  } catch (error) {
    console.log('[BILLBOARD_GET', error)
    return new NextResponse("Internal error", {status: 500})
  }

}


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
export async function DELETE(req:Request, {params} : {params : {storeId : string, billboardId: string}}){

  try {
    const {userId} = auth();
    
    //Checking if the user is logged
    if(!userId){
      return new NextResponse("Unauthorized", {status: 401})
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

    const billboard = await prismadb.billboard.deleteMany({
      where:{
        id: params.billboardId,
      }
    })

    return NextResponse.json(billboard)

  } catch (error) {
    console.log('[BILLBOARD_DELETE', error)
    return new NextResponse("Internal error", {status: 500})
  }

}
