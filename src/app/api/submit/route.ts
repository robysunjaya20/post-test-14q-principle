import { NextRequest, NextResponse } from "next/server";

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbz98MxkAuzulANZV35aCx41GAd_K49lJ9cDNX87hQCq6BJ_2TA5tukdqwaMunpkj6GYPw/exec";


export async function POST(
  request: NextRequest
) {

  try {

    const body =
      await request.text();


    if (
      !body ||
      body.trim() === ""
    ) {

      return NextResponse.json(
        {
          success: false,
          message:
            "Data yang dikirim kosong."
        },
        {
          status: 400
        }
      );

    }

    const response =
      await fetch(
        SCRIPT_URL,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body,

          redirect: "follow",

          cache: "no-store"
        }
      );

    const responseText =
      await response.text();


    if (
      !responseText ||
      responseText.trim() === ""
    ) {

      return NextResponse.json(
        {
          success: false,
          message:
            "Google Apps Script tidak mengembalikan response."
        },
        {
          status: 502
        }
      );

    }

    let data: {
      success?: boolean;
      message?: string;
      row?: number;
    };


    try {

      data =
        JSON.parse(
          responseText
        );

    } catch {

      return NextResponse.json(
        {
          success: false,
          message:
            "Response Google Apps Script bukan JSON.",
          detail:
            responseText.substring(
              0,
              2000
            )
        },
        {
          status: 502
        }
      );

    }

    if (
      !data.success
    ) {

      return NextResponse.json(
        {
          success: false,

          message:
            data.message ||
            "Data gagal disimpan."
        },
        {
          status: 500
        }
      );

    }

    return NextResponse.json(
      {
        success: true,

        message:
          data.message ||
          "Post Test berhasil disimpan.",

        row:
          data.row ?? null
      },
      {
        status: 200
      }
    );


  } catch (error) {


    return NextResponse.json(
      {
        success: false,

        message:
          "Gagal menghubungi Google Apps Script.",

        detail:
          error instanceof Error
            ? error.message
            : String(error)
      },
      {
        status: 500
      }
    );

  }

}