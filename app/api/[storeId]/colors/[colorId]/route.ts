import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

// GET INDIVIDUAL SIZE
export async function GET(req:Request, {params} : {params : { colorId: string}}){

  try {

    if(!params.colorId){
      return new NextResponse("Size ID required.", {status: 400})
    }

    const color = await prismadb.color.findUnique({
      where:{
        id: params.colorId,
      }
    })

    return NextResponse.json(color)

  } catch (error) {
    console.log('[COLOR_GET', error)
    return new NextResponse("Internal error", {status: 500})
  }

}


//UPDATE SIZE ROUTE
export async function PATCH(req:Request, {params} : {params : {storeId: string , colorId : string}}){

  try {
    const {userId} = auth();
    const body = await req.json();

    const {name, value} = body;
    
    //Checking if the user is logged
    if(!userId){
      return new NextResponse("Unauthorized", {status: 401})
    }

    //checking if we are receiving the Store name from the form
    if(!name){
      return new NextResponse("Name is required.", {status: 400})
    }

    if(!value){
      return new NextResponse("Value is required.", {status: 400})
    }

    if(!params.colorId){
      return new NextResponse("Color ID required.", {status: 400})
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

    const color = await prismadb.color.updateMany({
      where:{
        id: params.colorId,
      },
       data: {
        name,
        value
       }
    })

    return NextResponse.json(color)

  } catch (error) {
    console.log('[COLOR_PATCH', error)
    return new NextResponse("Internal error", {status: 500})
  }

}

//DELETE SIZE
//Even req is not being used the params only is returned in the second parameter of the function
export async function DELETE(req:Request, {params} : {params : {storeId : string, colorId: string}}){

  try {
    const {userId} = auth();
    
    //Checking if the user is logged
    if(!userId){
      return new NextResponse("Unauthorized", {status: 401})
    }

    if(!params.colorId){
      return new NextResponse("Size ID required.", {status: 400})
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

    const color = await prismadb.color.deleteMany({
      where:{
        id: params.colorId,
      }
    })

    return NextResponse.json(color)

  } catch (error) {
    console.log('[COLOR_DELETE', error)
    return new NextResponse("Internal error", {status: 500})
  }

}
