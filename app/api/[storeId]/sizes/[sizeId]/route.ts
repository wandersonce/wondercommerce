import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

// GET INDIVIDUAL SIZE
export async function GET(req:Request, {params} : {params : { sizeId: string}}){

  try {

    if(!params.sizeId){
      return new NextResponse("Size ID required.", {status: 400})
    }

    const size = await prismadb.size.findUnique({
      where:{
        id: params.sizeId,
      }
    })

    return NextResponse.json(size)

  } catch (error) {
    console.log('[SIZE_GET', error)
    return new NextResponse("Internal error", {status: 500})
  }

}


//UPDATE SIZE ROUTE
export async function PATCH(req:Request, {params} : {params : {storeId: string , sizeId : string}}){

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

    if(!params.sizeId){
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

    const size = await prismadb.size.updateMany({
      where:{
        id: params.sizeId,
      },
       data: {
        name,
        value
       }
    })

    return NextResponse.json(size)

  } catch (error) {
    console.log('[SIZE_PATCH', error)
    return new NextResponse("Internal error", {status: 500})
  }

}

//DELETE SIZE
//Even req is not being used the params only is returned in the second parameter of the function
export async function DELETE(req:Request, {params} : {params : {storeId : string, sizeId: string}}){

  try {
    const {userId} = auth();
    
    //Checking if the user is logged
    if(!userId){
      return new NextResponse("Unauthorized", {status: 401})
    }

    if(!params.sizeId){
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

    const size = await prismadb.size.deleteMany({
      where:{
        id: params.sizeId,
      }
    })

    return NextResponse.json(size)

  } catch (error) {
    console.log('[SIZE_DELETE', error)
    return new NextResponse("Internal error", {status: 500})
  }

}
