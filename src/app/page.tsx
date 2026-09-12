"use client";

import { useEffect, useState } from "react";
import SoalPostTest from "./soal-post-test";
import { KUNCI_JAWABAN } from "./kuncijawaban";

const DEPARTMENTS = [
  "IQC",
  "OQC",
  "Assy Seat",
  "Assy Mirror",
];

const TOTAL_SOAL = 14;

type ResultData = {
  benar: number;
  salah: number;
  total: number;
  nilai: number;
  detail: boolean[];
};

export default function Home() {
  // =========================================
  // DATA KARYAWAN
  // =========================================

  const [nama, setNama] = useState("");
  const [nik, setNik] = useState("");
  const [department, setDepartment] = useState("");
  const [tanggal, setTanggal] = useState("");

  // =========================================
  // STATUS TEST
  // =========================================

  const [testStarted, setTestStarted] =
    useState(false);

  const [submitted, setSubmitted] =
    useState(false);

  // =========================================
  // JAWABAN
  // =========================================

  const [answers, setAnswers] = useState<string[]>(
    Array(TOTAL_SOAL).fill("")
  );

  // =========================================
  // SOAL AKTIF
  // =========================================

  const [currentQuestion, setCurrentQuestion] =
    useState(1);

  // =========================================
  // HASIL
  // =========================================

  const [result, setResult] =
    useState<ResultData | null>(null);

  // =========================================
  // STATUS PENYIMPANAN
  // =========================================

  const [loading, setLoading] =
    useState(false);

  const [saveStatus, setSaveStatus] =
    useState("");

  // =========================================
  // SET TANGGAL HARI INI
  // =========================================

  useEffect(() => {
    const now = new Date();

    const yyyy = now.getFullYear();

    const mm = String(
      now.getMonth() + 1
    ).padStart(2, "0");

    const dd = String(
      now.getDate()
    ).padStart(2, "0");

    setTanggal(
      `${yyyy}-${mm}-${dd}`
    );
  }, []);

  // =========================================
  // NORMALIZE JAWABAN
  // =========================================

  function normalizeAnswer(
    value: string
  ) {
    return value
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  }

  // =========================================
  // CEK JAWABAN
  // =========================================

  function checkAnswer(
    answer: string,
    nomor: number
  ) {
    const normalized =
      normalizeAnswer(answer);

    if (!normalized) {
      return false;
    }

    const keys =
      KUNCI_JAWABAN[nomor - 1];

    if (!keys) {
      return false;
    }

    return keys.some(
      (key) =>
        normalizeAnswer(key) ===
        normalized
    );
  }

  // =========================================
  // UPDATE JAWABAN
  // =========================================

  function updateAnswer(
    value: string
  ) {
    if (submitted) {
      return;
    }

    setAnswers((prev) => {
      const next = [...prev];

      next[currentQuestion - 1] =
        value;

      return next;
    });
  }

  // =========================================
  // MULAI POST TEST
  // =========================================

  function handleStartTest() {
    if (!nama.trim()) {
      alert(
        "Silakan isi Nama terlebih dahulu."
      );
      return;
    }

    if (!nik.trim()) {
      alert(
        "Silakan isi NIK terlebih dahulu."
      );
      return;
    }

    if (!department) {
      alert(
        "Silakan pilih Department terlebih dahulu."
      );
      return;
    }

    if (!tanggal) {
      alert(
        "Silakan pilih Tanggal."
      );
      return;
    }

    setTestStarted(true);

    setCurrentQuestion(1);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // =========================================
  // SOAL BERIKUTNYA
  // =========================================

  function nextQuestion() {
    if (
      currentQuestion <
      TOTAL_SOAL
    ) {
      setCurrentQuestion(
        currentQuestion + 1
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  // =========================================
  // SOAL SEBELUMNYA
  // =========================================

  function previousQuestion() {
    if (
      currentQuestion > 1
    ) {
      setCurrentQuestion(
        currentQuestion - 1
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  // =========================================
  // PILIH NOMOR SOAL
  // =========================================

  function goToQuestion(
    nomor: number
  ) {
    setCurrentQuestion(nomor);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // =========================================
  // SUBMIT POST TEST
  // =========================================

  function handleSubmit() {
    if (!nama.trim()) {
      alert(
        "Nama belum diisi."
      );
      return;
    }

    if (!nik.trim()) {
      alert(
        "NIK belum diisi."
      );
      return;
    }

    if (!department) {
      alert(
        "Department belum dipilih."
      );
      return;
    }

    if (!tanggal) {
      alert(
        "Tanggal belum dipilih."
      );
      return;
    }

    // Cek apakah masih ada soal kosong
    const soalKosong =
      answers.some(
        (answer) =>
          !answer.trim()
      );

    if (soalKosong) {
      const nomorKosong =
        answers.findIndex(
          (answer) =>
            !answer.trim()
        ) + 1;

      setCurrentQuestion(
        nomorKosong
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      alert(
        `Soal nomor ${nomorKosong} belum dijawab.`
      );

      return;
    }

    // =====================================
    // HITUNG HASIL
    // =====================================

    const detail =
      answers.map(
        (answer, index) =>
          checkAnswer(
            answer,
            index + 1
          )
      );

    const benar =
      detail.filter(
        Boolean
      ).length;

    const salah =
      TOTAL_SOAL - benar;

    const nilai =
      Math.round(
        (benar /
          TOTAL_SOAL) *
          100
      );

    // =====================================
    // TAMPILKAN HASIL SEGERA
    // =====================================

    setResult({
      benar,
      salah,
      total: TOTAL_SOAL,
      nilai,
      detail,
    });

    setSubmitted(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    // =====================================
    // SIMPAN KE GOOGLE SHEETS
    // =====================================

    setLoading(true);

    setSaveStatus(
      "Menyimpan jawaban..."
    );

    void fetch(
      "/api/submit",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          nama,
          nik,
          department,
          tanggal,

          q14Answers:
            answers,

          benar,

          salah,

          total:
            TOTAL_SOAL,

          nilai,
        }),
      }
    )
      .then(
        async (response) => {
          const data =
            await response.json();

          if (
            !response.ok ||
            !data.success
          ) {
            throw new Error(
              data.message ||
                "Gagal menyimpan data."
            );
          }

          setSaveStatus(
            "✓ Jawaban berhasil disimpan."
          );
        }
      )
      .catch(() => {
        setSaveStatus(
          "⚠ Hasil sudah ditampilkan, tetapi penyimpanan gagal."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }

  // =========================================
  // TEST BARU
  // =========================================

  function handleReset() {
    setNama("");

    setNik("");

    setDepartment("");

    // Tanggal kembali ke hari ini
    const now = new Date();

    const yyyy =
      now.getFullYear();

    const mm =
      String(
        now.getMonth() + 1
      ).padStart(2, "0");

    const dd =
      String(
        now.getDate()
      ).padStart(2, "0");

    setTanggal(
      `${yyyy}-${mm}-${dd}`
    );

    setAnswers(
      Array(
        TOTAL_SOAL
      ).fill("")
    );

    setCurrentQuestion(1);

    setTestStarted(false);

    setSubmitted(false);

    setResult(null);

    setLoading(false);

    setSaveStatus("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // =========================================
  // PROGRESS
  // =========================================

  const progress =
    (currentQuestion /
      TOTAL_SOAL) *
    100;

  // =========================================
  // RENDER
  // =========================================

  return (
    <main className="postPage">

      {/* =====================================
          HEADER
      ===================================== */}

      <header className="postHeader">

        <div className="brandBox">

          <div className="brandMain">
            BUMJIN
          </div>

          <div className="brandSub">
            QUALITY TRAINING
          </div>

        </div>


        <div className="headerTitle">

          <div className="smallTitle">
            14Q BASICS PRINCIPLE
          </div>

          <h1>
            POST TEST
          </h1>

          <p>
            Evaluasi pemahaman peserta
          </p>

        </div>

      </header>


      {/* =====================================
          HASIL TEST
      ===================================== */}

      {result && (
        <section className="resultCard">

          <div className="resultTitle">
            HASIL POST TEST
          </div>

          <div className="resultScore">
            {result.nilai}
          </div>

          <div className="resultLabel">
            NILAI
          </div>


          <div className="resultStats">

            <div>
              <strong>
                {result.benar}
              </strong>

              <span>
                Benar
              </span>
            </div>


            <div>
              <strong>
                {result.salah}
              </strong>

              <span>
                Salah
              </span>
            </div>


            <div>
              <strong>
                {result.total}
              </strong>

              <span>
                Total Soal
              </span>
            </div>

          </div>


          <div className="resultMessage">

            {result.nilai >= 80
              ? "✓ Selamat, hasil Anda sangat baik."
              : "Tetap semangat dan tingkatkan pemahaman Anda."}

          </div>

        </section>
      )}


      {/* =====================================
          DATA KARYAWAN
      ===================================== */}

      <section className="participantCard">

        <div className="sectionTitle">
          DATA KARYAWAN
        </div>


        <div className="participantGrid">

          {/* NAMA */}

          <div className="fieldGroup fieldName">

            <label>
              Nama
            </label>

            <input
              type="text"
              value={nama}
              onChange={(e) =>
                setNama(
                  e.target.value
                )
              }
              disabled={
                testStarted
              }
              placeholder="Masukkan nama lengkap"
              autoComplete="name"
            />

          </div>


          {/* NIK */}

          <div className="fieldGroup">

            <label>
              NIK
            </label>

            <input
              type="text"
              value={nik}
              onChange={(e) =>
                setNik(
                  e.target.value
                )
              }
              disabled={
                testStarted
              }
              placeholder="Masukkan NIK"
              autoComplete="off"
            />

          </div>


          {/* DEPARTMENT */}

          <div className="fieldGroup">

            <label>
              Department
            </label>

            <select
              value={department}
              onChange={(e) =>
                setDepartment(
                  e.target.value
                )
              }
              disabled={
                testStarted
              }
            >

              <option value="">
                Pilih Department
              </option>

              {DEPARTMENTS.map(
                (item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                )
              )}

            </select>

          </div>


          {/* TANGGAL */}

          <div className="fieldGroup">

            <label>
              Tanggal
            </label>

            <input
              type="date"
              value={tanggal}
              onChange={(e) =>
                setTanggal(
                  e.target.value
                )
              }
              disabled={
                testStarted
              }
            />

          </div>

        </div>


        {/* =================================
            MULAI POST TEST
        ================================= */}

        {!testStarted && (

          <button
            type="button"
            className="startTestButton"
            onClick={
              handleStartTest
            }
          >
            MULAI POST TEST →
          </button>

        )}

      </section>


      {/* =====================================
          TEST
      ===================================== */}

      {testStarted && (

        <section className="testCard">

          {/* PROGRESS */}

          {!submitted && (

            <>

              <div className="progressHeader">

                <div>

                  <strong>
                    Soal{" "}
                    {currentQuestion}
                  </strong>

                  <span>
                    {" "}
                    dari{" "}
                    {TOTAL_SOAL}
                  </span>

                </div>


                <div className="progressPercent">
                  {Math.round(
                    progress
                  )}
                  %
                </div>

              </div>


              <div className="progressBar">

                <div
                  className="progressFill"
                  style={{
                    width:
                      `${progress}%`,
                  }}
                />

              </div>

            </>

          )}


          {/* SOAL */}

          <SoalPostTest
            nomor={
              currentQuestion
            }

            jawaban={
              answers[
                currentQuestion - 1
              ]
            }

            submitted={
              submitted
            }

            benar={
              submitted &&
              result
                ? result.detail[
                    currentQuestion - 1
                  ]
                : null
            }

            updateJawaban={
              updateAnswer
            }
          />


          {/* =================================
              NAVIGASI SEBELUM SUBMIT
          ================================= */}

          {!submitted && (

            <div className="navigationButtons">

              <button
                type="button"
                onClick={
                  previousQuestion
                }
                disabled={
                  currentQuestion ===
                  1
                }
                className="btnPrevious"
              >
                ← Sebelumnya
              </button>


              {currentQuestion <
              TOTAL_SOAL ? (

                <button
                  type="button"
                  onClick={
                    nextQuestion
                  }
                  className="btnNext"
                >
                  Berikutnya →
                </button>

              ) : (

                <button
                  type="button"
                  onClick={
                    handleSubmit
                  }
                  className="btnSubmit"
                >
                  SUBMIT POST TEST
                </button>

              )}

            </div>

          )}


          {/* =================================
              SETELAH SUBMIT
          ================================= */}

          {submitted && (

            <div className="submittedActions">

              {currentQuestion <
                TOTAL_SOAL && (

                <button
                  type="button"
                  onClick={
                    nextQuestion
                  }
                  className="btnNext"
                >
                  Soal Berikutnya →
                </button>

              )}


              <button
                type="button"
                onClick={
                  handleReset
                }
                className="btnNewTest"
              >
                ISI TEST BARU
              </button>

            </div>

          )}

        </section>

      )}


      {/* =====================================
          DAFTAR NOMOR SOAL
      ===================================== */}

      {testStarted && (

        <section className="questionNavigator">

          <div className="navigatorTitle">
            Daftar Soal
          </div>


          <div className="numberGrid">

            {answers.map(
              (_, index) => {

                const nomor =
                  index + 1;

                let className =
                  "numberButton";


                // Setelah submit
                if (
                  submitted &&
                  result
                ) {

                  className +=
                    result.detail[
                      index
                    ]
                      ? " numberCorrect"
                      : " numberWrong";

                }

                // Soal aktif
                else if (
                  nomor ===
                  currentQuestion
                ) {

                  className +=
                    " numberActive";

                }

                // Sudah dijawab
                else if (
                  answers[
                    index
                  ].trim()
                ) {

                  className +=
                    " numberAnswered";

                }


                return (

                  <button
                    key={nomor}
                    type="button"
                    className={
                      className
                    }
                    onClick={() =>
                      goToQuestion(
                        nomor
                      )
                    }
                  >
                    {nomor}
                  </button>

                );

              }
            )}

          </div>

        </section>

      )}


      {/* =====================================
          STATUS PENYIMPANAN
      ===================================== */}

      {saveStatus && (

        <div className="saveStatus">

          {saveStatus}

          {loading && (
            <span>
              {" "}
              Mohon tunggu...
            </span>
          )}

        </div>

      )}


      {/* =====================================
          FOOTER
      ===================================== */}

      <footer className="postFooter">

        <strong>
          BUMJIN ELECTRONICS INDONESIA
        </strong>

        <span>
          Quality Training Department
        </span>

      </footer>

    </main>
  );
}