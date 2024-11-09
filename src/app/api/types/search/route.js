import prisma from '../../../../../lib/prisma';
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
      const { searchParams } = new URL(req.url);
      const generationIds = searchParams.getAll('generationId').map(id => parseInt(id));
  
      if (generationIds.length === 0 || generationIds.some(isNaN)) {
        return NextResponse.json(
          { error: 'Invalid or missing generation_id' },
          { status: 400 }
        );
      }
  
      const types = await prisma.types.findMany({
        where: {
            generation_id: {
              in: generationIds
            }
        },
      });
  
      return NextResponse.json(
        { types },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
  }