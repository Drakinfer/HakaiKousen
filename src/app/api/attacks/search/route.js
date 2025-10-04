import prisma from '../../../../../lib/prisma';
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
      const { searchParams } = new URL(req.url);
      const generationIds = searchParams.getAll('generationId').map(id => parseInt(id));
      const typeIds = searchParams.getAll('typeId').map(id => parseInt(id));
  
      if (generationIds.length === 0 && typeIds.length === 0) {
        return NextResponse.json(
          { error: 'Invalid or missing generation_id' },
          { status: 400 }
        );
      }
  
      const attaques = await prisma.attaques.findMany({
        where: {
          attaques_generations: {
            some: {
                ...(generationIds.length > 0 && { generation_id: { in: generationIds } }),
                ...(typeIds.length > 0 && { type_id: { in: typeIds } })
            }
          }
        }
      });
  
      return NextResponse.json(
        { attaques },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
  }