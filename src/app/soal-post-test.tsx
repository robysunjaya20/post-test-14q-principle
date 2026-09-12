"use client";

type SoalPostTestProps = {
  nomor: number;
  jawaban: string;
  submitted: boolean;
  benar: boolean | null;
  updateJawaban: (value: string) => void;
};

const SOAL = [
  "Apa prinsip 14Q yang menggunakan tanda berhenti untuk mencegah kesalahan?",
  "Apa prinsip 14Q yang menggunakan sistem peringatan dini?",
  "Apa prinsip 14Q yang berhubungan dengan instruksi kerja?",
  "Apa prinsip 14Q yang berhubungan dengan parameter proses?",
  "Apa prinsip 14Q yang berhubungan dengan peralatan pengukuran?",
  "Apa prinsip 14Q yang berhubungan dengan pemeriksaan terhadap pemeriksa?",
  "Apa prinsip 14Q yang berhubungan dengan Total Productive Maintenance?",
  "Apa prinsip 14Q yang berhubungan dengan alat kerja?",
  "Apa prinsip 14Q yang dilakukan setelah proses dihentikan?",
  "Apa prinsip 14Q yang berhubungan dengan pemberian identitas/penandaan?",
  "Apa prinsip 14Q yang berhubungan dengan produk yang dikerjakan ulang?",
  "Apa prinsip 14Q yang berhubungan dengan produk reject yang dibuang?",
  "Apa prinsip 14Q yang berhubungan dengan part yang terjatuh?",
  "Apa prinsip 14Q yang berhubungan dengan produk yang benar?",
];

export default function SoalPostTest({
  nomor,
  jawaban,
  submitted,
  benar,
  updateJawaban,
}: SoalPostTestProps) {
  const soal = SOAL[nomor - 1];

  return (
    <div className="postQuestionCard">
      <div className="questionTop">
        <div className="questionNumber">
          {nomor}
        </div>

        <div className="questionLabel">
          SOAL {nomor}
        </div>
      </div>

      <div className="questionText">
        {soal}
      </div>

      <div className="answerLabel">
        Jawaban Anda
      </div>

      <input
        type="text"
        value={jawaban}
        onChange={(e) => updateJawaban(e.target.value)}
        disabled={submitted}
        placeholder="Ketik jawaban Anda..."
        className={
          submitted
            ? benar
              ? "postAnswerInput answerCorrect"
              : "postAnswerInput answerWrong"
            : "postAnswerInput"
        }
        autoComplete="off"
      />

      {submitted && (
        <div
          className={
            benar
              ? "postAnswerStatus correctStatus"
              : "postAnswerStatus wrongStatus"
          }
        >
          {benar ? "✓ Jawaban Benar" : "✕ Jawaban Salah"}
        </div>
      )}
    </div>
  );
}