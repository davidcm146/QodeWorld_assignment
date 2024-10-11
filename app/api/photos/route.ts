import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const { url } = await req.json();
        const photo = await prisma.photo.create({ data: { url } });

        return NextResponse.json(photo, { status: 201 });
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to create photo" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const photos = await prisma.photo.findMany({ include: { comments: true } });

        return NextResponse.json(photos, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to fetch photos" },
            { status: 500 }
        );
    }
}
