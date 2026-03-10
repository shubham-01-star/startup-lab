import { NextRequest, NextResponse } from "next/server";
import { getDB } from "@/lib/db";
import { ContactMessage } from "@/entities/ContactMessage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// POST /api/contact — Public: submit contact form
export async function POST(req: NextRequest) {
    const db = await getDB();
    const repo = db.getRepository(ContactMessage);
    const body = await req.json();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (body.company) {
        return NextResponse.json({ success: true }, { status: 200 });
    }

    if (!body.name || !body.email || !body.subject || !body.message) {
        return NextResponse.json(
            { error: "All fields are required" },
            { status: 400 }
        );
    }

    if (!emailPattern.test(body.email)) {
        return NextResponse.json(
            { error: "Please enter a valid email." },
            { status: 400 }
        );
    }

    if (body.message.length < 20) {
        return NextResponse.json(
            { error: "Message must be at least 20 characters" },
            { status: 400 }
        );
    }

    const message = repo.create({
        name: body.name,
        email: body.email,
        subject: body.subject,
        message: body.message,
    });

    await repo.save(message);

    return NextResponse.json(
        { success: true, message: "Message sent successfully!" },
        { status: 201 }
    );
}

// GET /api/contact — Admin: list messages
export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDB();
    const messages = await db.getRepository(ContactMessage).find({
        order: { created_at: "DESC" },
    });

    return NextResponse.json(messages);
}

// PATCH /api/contact — Admin: mark as read
export async function PATCH(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const db = await getDB();
    const repo = db.getRepository(ContactMessage);
    const message = await repo.findOne({ where: { id: body.id } });

    if (!message) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    message.is_read = body.is_read ?? true;
    await repo.save(message);

    return NextResponse.json(message);
}

// DELETE /api/contact — Admin: delete message
export async function DELETE(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
        return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const db = await getDB();
    await db.getRepository(ContactMessage).delete(parseInt(id));

    return NextResponse.json({ success: true });
}
