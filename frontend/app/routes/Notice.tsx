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
      className="mb-3 shadow-sm"
      style={{
        width: "100%",
        maxWidth: "350px",
        height: "400px",
        borderRadius: "10px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Image Section */}
      {file && (
        <Card.Img
          variant="top"
          src={`data:image/jpeg;base64,${file}`}
          style={{
            maxHeight: "200px",
            objectFit: "cover",
          }}
          alt={title}
        />
      )}

      {/* Card Body */}
      <Card.Body
        style={{
          flex: "1 1 auto",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          {/* Title */}
          <Card.Title style={{ fontSize: "20px", fontWeight: "bold" }}>
            {title}
          </Card.Title>

          {/* Content */}
          <Card.Text style={{ fontSize: "14px", marginBottom: "8px" }}>
            {content}
          </Card.Text>

          {/* Poster */}
          <Card.Text style={{ fontSize: "13px", color: "#666" }}>
            Ilmoittaja: <strong>{poster}</strong>
          </Card.Text>

          {/* Contact Info */}
          {contact_info && (
            <Card.Text style={{ fontSize: "13px", color: "#666" }}>
              Yhteystiedot: <strong>{contact_info}</strong>
            </Card.Text>
          )}
        </div>

        {/* Admin Button */}
        {isAdmin && (
          <Button
            variant="danger"
            size="sm"
            onClick={onDelete}
            className="mt-3"
            style={{
              alignSelf: "flex-end",
            }}
          >
            Poista
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}