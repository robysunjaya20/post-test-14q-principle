import { NextRequest, NextResponse } from "next/server";

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxXCtXfw5B28gwj-eD9hg2m3Ft59u9E4_tuWDcZAT7NHlYZ7kkyxVRzrHD96r6kmYm9-Q/exec";

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.text();

    if (!body.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Data kosong.",
        },
        { status: 400 }
      );
    }

    const response = await fetch(
      SCRIPT_URL,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body,
        redirect: "follow",
        cache: "no-store",
      }
    );

    const text =
      await response.text();

    let data;

    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json(
        {
          success: false,
          message:
            "Response Apps Script bukan JSON.",
        },
        { status: 502 }
      );
    }

    if (!data.success) {
      return NextResponse.json(
        {
          success: false,
          message:
            data.message ||
            "Gagal menyimpan.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Jawaban berhasil disimpan.",
    });

  } catch (error) {

    return NextResponse.json(
      {
        success: false,
        message:
          "Gagal menghubungi Google Apps Script.",
        detail:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}