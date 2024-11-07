import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import Section from "./Section";
import AddAnnouncementForm from "./AddAnnouncementForm";
import { v4 as uuidv4 } from "uuid";

interface Announcement {
  _id: string;
  category: string;
  title: string;
  content: string;
  poster?: string;
  contact_info?: string;
}

interface Advertisement {
  id: string;
  file: string;
}

export default function NoticeBoard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState("Disconnected");
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [announcementId, setAnnouncementId] = useState("");
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket("ws://localhost:5000/announcements/");

    ws.current.onopen = () => {
      setStatus("Connected");
      console.log("Connected to WebSocket server");
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleIncomingMessage(data);
    };

    ws.current.onclose = () => {
      setStatus("Disconnected");
      console.log("Disconnected from WebSocket server");
    };

    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  const handleIncomingMessage = (data: any) => {
    console.log("Received data:", data); // Log data to confirm structure
    setAnnouncementId(data.announcmentId); // Use data.announcmentId as sent from backend
    if (data.announcements) {
      setAnnouncements(data.announcements);
    }
    if (data.advertisements) {
      setAdvertisements(data.advertisements);
    }
    if (data.type === "announcementadd" && data.data.announcement) {
      setAnnouncements((prev) => [...prev, data.data.announcement]);
    }
  };

  const handleAddAnnouncement = async (newAnnouncement: Omit<Announcement, "_id">) => {
    console.log("Using announcementId:", announcementId); // Log announcementId to confirm it's correct

    try {
      const initResponse = await fetch(`http://localhost:5000/new/${announcementId}/`);
      if (initResponse.ok) {
        const response = await fetch(
          `http://localhost:5000/api/announcements/add/${announcementId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newAnnouncement),
          }
        );
        if (response.ok) {
          console.log("Announcement saved and broadcasted.");
          setIsModalOpen(false);
        } else {
          console.error("Error saving announcement:", response.statusText);
        }
      } else {
        console.error("Initialization failed:", initResponse.statusText);
      }
    } catch (error) {
      console.error("Failed to add announcement:", error);
    }
  };

  const filterAnnouncementsByCategory = (category: string) =>
    announcements.filter((announcement) => announcement.category === category);

  return (
    <Container fluid>
      <h1 className="text-center mb-4">Ilmoitustaulu</h1>

      <Row className="mb-4">
        <Col md={4}>
          <Section title="Tarjoukset" announcements={filterAnnouncementsByCategory("tarjous")} />
        </Col>
        <Col md={8}>
          <Section
            title="Asiakastoiveet"
            announcements={filterAnnouncementsByCategory("asiakastoive")}
          />
        </Col>
      </Row>

      <Row>
        <Col md={4} className="d-flex flex-column align-items-center justify-content-center">
          <p className="text-center">Lisää oma ilmoituksesi skannaamalla QR-koodi</p>
          <img src="QR_Test.svg" alt="QR Code" className="img-fluid" style={{ width: "100px" }} />
        </Col>
        <Col md={8}>
          <Section
            title="Myynti-ilmoitukset"
            announcements={filterAnnouncementsByCategory("myynti-ilmoitus")}
          />
        </Col>
      </Row>

      <div className="text-center mt-4">
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          Add New Announcement
        </Button>
      </div>

      <Modal show={isModalOpen} onHide={() => setIsModalOpen(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add a New Announcement</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddAnnouncementForm
            onAddAnnouncement={(newAnnouncement) => {
              handleAddAnnouncement(newAnnouncement);
              setIsModalOpen(false);
            }}
          />
        </Modal.Body>
      </Modal>
    </Container>
  );
}
