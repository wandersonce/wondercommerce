import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs"
import { NextResponse } from "next/server"

export async function POST(req: Request, {params} : {params : {storeId : string}}){
  try {
    const { userId } = auth();
    const body = await req.json();

    const {name, value} = body;

    //Checking if the user is logged
    if(!userId){
      return new NextResponse("Unauthenticated", {status: 401})
    }

    //checking if we are receiving the Store name from the form
    if(!name){
      return new NextResponse("Name is required.", {status: 401})
    }
    if(!value){
      return new NextResponse("Value required.", {status: 401})
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

    const color = await prismadb.color.create({
      data:{
        name,
        value,
        storeId: params.storeId
      }
    })

    return NextResponse.json(color)


  } catch (error) {
    console.log("[COLOR_POST]", error)
    return new NextResponse("Internal error", {status: 500})
  }
}

export async function GET(req: Request, {params} : {params : {storeId : string}}){
  try {

    if(!params.storeId){
      return new NextResponse("Store ID is required.", {status: 401})
    }

    const colors = await prismadb.color.findMany({
      where:{
        storeId: params.storeId
      }
    })

    return NextResponse.json(colors)


  } catch (error) {
    console.log("[COLORS_GET]", error)
    return new NextResponse("Internal error", {status: 500})
  }
}