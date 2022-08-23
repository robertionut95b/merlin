import type {
  PricingPolicy,
  ScreenEvent,
  Screening,
  Seat,
  Ticket,
} from "@prisma/client";
import { Document, Image, Page, Text, View } from "@react-pdf/renderer";
import { format } from "date-fns";

interface PDFMovieTicketProps {
  ticket: Ticket & {
    ScreenEvent: ScreenEvent & {
      screening: Screening;
      pricingPolicy: PricingPolicy[];
    };
    seats: Seat[];
  };

  movie: Screening;
  qrcode: string;
}

export default function PDFMovieTicket({
  movie,
  ticket,
  qrcode,
}: PDFMovieTicketProps) {
  return (
    <Document title={`Merlin App - ${movie.title} - #${ticket.id}`}>
      <Page size="A6" orientation="landscape">
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            backgroundColor: "royalblue",
            alignItems: "stretch",
            height: "100vh",
          }}
        >
          <View
            style={{
              margin: 10,
              flexGrow: 2,
              alignContent: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontWeight: "extrabold",
                fontSize: "26px",
                color: "white",
                marginBottom: "25px",
              }}
            >
              {movie.title}
            </Text>
            <Text
              style={{
                color: "white",
                fontSize: "10px",
              }}
            >
              Merlin Cinema
            </Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: "14px",
                }}
              >
                Date: {format(ticket.time, "dd-MM-yyyy")}
              </Text>
              <Text
                style={{
                  color: "white",
                  fontSize: "14px",
                }}
              >
                Time: {format(ticket.time, "HH:mm")}
              </Text>
            </View>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: "15px",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: "14px",
                }}
              >
                {`Row: ${ticket.seats?.[0].row} Seat: ${ticket.seats?.[0].column}`}
              </Text>
              <Text
                style={{
                  color: "white",
                  fontSize: "14px",
                }}
              >
                Price: {ticket.ScreenEvent.pricingPolicy?.[0].price} RON
              </Text>
            </View>
          </View>
          <View
            style={{
              backgroundColor: "#fff",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              padding: "10px",
            }}
          >
            <Image
              source={qrcode}
              style={{
                width: 150,
                height: 150,
                backgroundColor: "transparent",
              }}
            />
            <Text style={{ fontSize: "12px" }}>{ticket.id}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
