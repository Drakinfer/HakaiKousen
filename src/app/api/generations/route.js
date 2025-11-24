import prisma from '../../../../lib/prisma';
import { NextResponse } from "next/server";

export async function GET(req) {
    try{
      const generations = await prisma.generations.findMany()
  
      return NextResponse.json(
        { generations },
        {status: 200});
    }catch(error) {
      return NextResponse.json(
        { error: 'failed to fetch generation' },
        {status: 500});
    }
}

export async function POST(req) {
    try {
        const data = await req.json();

        const generation = data;

        if (!generation || !generation.name || !generation.rank) {
            return NextResponse.json(
                { error: 'Name and rank are required for a generation' },
                { status: 400 }
            );
        }
        
        const newGeneration = await prisma.generations.create({
            data: {
                name: generation.name,
                rank: generation.rank,
            },
        });

        return NextResponse.json(
            { generation: newGeneration },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}