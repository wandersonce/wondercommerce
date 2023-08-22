import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

// GET INDIVIDUAL CATEGORY
export async function GET(req:Request, {params} : {params : { categoryId: string}}){

  try {

    if(!params.categoryId){
      return new NextResponse("Category ID required.", {status: 400})
    }

    const category = await prismadb.category.findUnique({
      where:{
        id: params.categoryId,
      }
    })

    return NextResponse.json(category)

  } catch (error) {
    console.log('[CATEGORY_GET', error)
    return new NextResponse("Internal error", {status: 500})
  }

}


//UPDATE CATEGORY ROUTE
export async function PATCH(req:Request, {params} : {params : {storeId: string , categoryId : string}}){

  try {
    const {userId} = auth();
    const body = await req.json();

    const {name, billboardId} = body;
    
    //Checking if the user is logged
    if(!userId){
      return new NextResponse("Unauthorized", {status: 401})
    }

    //checking if we are receiving the Store name from the form
    if(!name){
      return new NextResponse("Name is required.", {status: 400})
    }

    if(!billboardId){
      return new NextResponse("Billboard ID is required.", {status: 400})
    }

    if(!params.categoryId){
      return new NextResponse("Category ID required.", {status: 400})
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

    const category = await prismadb.category.updateMany({
      where:{
        id: params.categoryId,
      },
       data: {
        name,
        billboardId
       }
    })

    return NextResponse.json(category)

  } catch (error) {
    console.log('[CATEGORY_PATCH', error)
    return new NextResponse("Internal error", {status: 500})
  }

}

//DELETE CATEGORY
//Even req is not being used the params only is returned in the second parameter of the function
export async function DELETE(req:Request, {params} : {params : {storeId : string, categoryId: string}}){

  try {
    const {userId} = auth();
    
    //Checking if the user is logged
    if(!userId){
      return new NextResponse("Unauthorized", {status: 401})
    }

    if(!params.categoryId){
      return new NextResponse("Category ID required.", {status: 400})
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

    const category = await prismadb.category.deleteMany({
      where:{
        id: params.categoryId,
      }
    })

    return NextResponse.json(category)

  } catch (error) {
    console.log('[CATEGORY_DELETE', error)
    return new NextResponse("Internal error", {status: 500})
  }

}
