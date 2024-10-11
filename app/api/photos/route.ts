import {NextResponse} from 'next/server'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

export async function POST(req: Request) {
    const {url} = await req.json();

    const photo = await prisma.photo.create ({data : {url}});

    return NextResponse.json(photo, {status : 201});
}

export async function GET() {
    const photos = await prisma.photo.findMany({include : {comments : true}});
    return NextResponse.json(photos, {status : 201});
}