const nodemailer = require("nodemailer");

const {
  AMAZON_URL,
  EMAIL_USER,
  EMAIL_PASS,
  EMAIL_TO
} = process.env;

async function main() {
  if (!AMAZON_URL || !EMAIL_USER || !EMAIL_PASS || !EMAIL_TO) {
    throw new Error("Faltan variables de entorno.");
  }

  const response = await fetch(AMAZON_URL, {
    method: "GET",
    headers: {
      "User-Agent": "Mozilla/5.0",
      "Accept-Language": "es-ES,es;q=0.9,en;q=0.8"
    }
  });

  const body = await response.text();
  const lowerBody = body.toLowerCase();

  const found =
    lowerBody.includes("reservar") ||
    lowerBody.includes("reserva") ||
    lowerBody.includes("comprar");

  if (!found) {
    console.log("No aparece reservar ni comprar.");
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: EMAIL_USER,
    to: EMAIL_TO,
    subject: "Amazon: ya aparece reservar o comprar",
    text: `La página contiene "reservar" o "comprar":\n\n${AMAZON_URL}`
  });

  console.log("Correo enviado.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
