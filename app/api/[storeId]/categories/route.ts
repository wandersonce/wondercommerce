import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function POST(req: Request, {params} : {params : {storeId : string}}){
  try {
    const { userId } = auth();
    const body = await req.json();

    const {name, billboardId} = body;

    //Checking if the user is logged
    if(!userId){
      return new NextResponse("Unauthenticated", {status: 401})
    }

    //checking if we are receiving the Store name from the form
    if(!name){
      return new NextResponse("Name is required.", {status: 401})
    }
    if(!billboardId){
      return new NextResponse("Billboard ID is required.", {status: 401})
    }

    if(!params.storeId){
      return new NextResponse("Store ID is required.", {status: 401})
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

    const category = await prismadb.category.create({
      data:{
        name,
        billboardId,
        storeId: params.storeId
      }
    })

    return NextResponse.json(category)


  } catch (error) {
    console.log("[CATEGORIES_POST]", error)
    return new NextResponse("Internal error", {status: 500})
  }
}

export async function GET(req: Request, {params} : {params : {storeId : string}}){
  try {

    if(!params.storeId){
      return new NextResponse("Store ID is required.", {status: 401})
    }

    const categories = await prismadb.category.findMany({
      where:{
        storeId: params.storeId
      }
    })

    return NextResponse.json(categories)


  } catch (error) {
    console.log("[CATEGORIES_GET]", error)
    return new NextResponse("Internal error", {status: 500})
  }
}