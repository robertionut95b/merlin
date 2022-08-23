import type {
  PricingPolicy,
  ScreenEvent,
  Screening,
  Seat,
  Ticket,
} from "@prisma/client";
import ReactPDF from "@react-pdf/renderer";
import type { LoaderFunction } from "@remix-run/node";
import QRCode from "qrcode";
import PDFMovieTicket from "~/components/pdf/PDFMovieTicket";
import { getUniqueTicket } from "~/models/tickets.server";

export let loader: LoaderFunction = async ({ params }) => {
  const ticket = await getUniqueTicket({
    where: {
      id: params.ticketId,
    },
    include: {
      ScreenEvent: {
        include: {
          screening: true,
          pricingPolicy: true,
        },
      },
      seats: true,
    },
  });

  if (!ticket) {
    throw new Response("Ticket not found", {
      status: 404,
    });
  }

  const qrcode = await QRCode.toDataURL(ticket.id);
  const stream = await ReactPDF.renderToStream(
    <PDFMovieTicket
      ticket={
        ticket as Ticket & {
          ScreenEvent: ScreenEvent & {
            screening: Screening;
            pricingPolicy: PricingPolicy[];
          };
          seats: Seat[];
        }
      }
      movie={
        (
          ticket as Ticket & {
            ScreenEvent: ScreenEvent & {
              screening: Screening;
              pricingPolicy: PricingPolicy[];
            };
            seats: Seat[];
          }
        ).ScreenEvent.screening
      }
      qrcode={qrcode}
    />
  );

  let body: Buffer = await new Promise((resolve, reject) => {
    let buffers: Uint8Array[] = [];
    stream.on("data", (data) => {
      buffers.push(data);
    });
    stream.on("end", () => {
      resolve(Buffer.concat(buffers));
    });
    stream.on("error", reject);
  });
  // renturn the response
  return new Response(body, { status: 200 });
};
