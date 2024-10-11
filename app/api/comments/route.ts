import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const { content, photoId } = await req.json();

        const comment = await prisma.comment.create({
            data: {
                content,
                photoId,
            },
        });

        return NextResponse.json(comment, { status: 201 });
    } catch (error) {
        console.error("Error creating comment:", error);

        return NextResponse.json(
            { message: "Failed to create comment" },
            { status: 500 }
        );
    }
}
