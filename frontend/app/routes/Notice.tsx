import { Card, Button } from "react-bootstrap";

interface NoticeProps {
  title: string;
  content: string;
  poster: string;
  contact_info?: string;
  file?: BinaryData;
  isAdmin?: boolean;
  onDelete?: () => void;
}

export default function Notice({
  title,
  content,
  poster,
  contact_info,
  file,
  isAdmin,
  onDelete,
}: NoticeProps) {
  return (
<Card
  className="mb-4 shadow-sm"
  style={{
    width: "100%",
    height: "200px",
    border: "2px solid #f4e975",
    borderRadius: "15px",
    overflow: "hidden",
    padding: "0px",
    backgroundColor: "#f9f9f9",
    position: "relative", // Tarvitaan absoluuttisesti sijoitettua nappia varten
  }}
>
  {/* Admin-painike yläkulmassa */}
  {isAdmin && onDelete && (
    <Button
      variant="danger"
      size="sm"
      onClick={onDelete}
      style={{
        position: "absolute",
        top: "10px",
        right: "10px",
        zIndex: 10,
        width: "70px",
      }}
    >
      Poista
    </Button>
  )}

  <Card.Body style={{ display: "flex", flexDirection: "row" }}>
    <div style={{ flex: 2, paddingRight: "10px" }}>
      <p style={{ marginBottom: "5px" }}>Ilmoittaja: {poster}</p>
      {contact_info && (
        <>
          <p style={{ marginBottom: "5px" }}>Yhteystiedot: {contact_info}</p>
        </>
      )}
      <p style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "10px" }}>
        {title}
      </p>
      <p style={{ fontSize: "14px", marginBottom: "0" }}>{content}</p>
    </div>

    {file && (
      <div style={{ flex: 1, textAlign: "center" }}>
        <img
          src={`data:image/jpeg;base64,${file}`}
          alt="Kuva"
          style={{
            maxWidth: "100%",
            maxHeight: "160px",
            objectFit: "cover",
            border: "1px solid #ccc",
          }}
        />
      </div>
    )}
  </Card.Body>
</Card>
  );
} 