import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import AddAnnouncementForm from "./AddAnnouncementForm";
import AddAdvertisementForm from "./AddAdvertisementForm";
import AdvertisementGrid from "./AdvertisementGrid";
import CustomCarousel from "./CustomCarousel"; // Import the custom carousel component
import { QRCodeSVG } from "qrcode.react";
import config from "../config";
import { DataFromServer, IAdvertisement, IAnnouncement } from "../../interfaces";
import "bootstrap/dist/css/bootstrap.min.css";
import "../custom.css";

export default function NoticeBoard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdModalOpen, setIsAdModalOpen] = useState(false);
  const [status, setStatus] = useState("Disconnected");
  const [announcements, setAnnouncements] = useState<IAnnouncement[]>([]);
  const [advertisements, setAdvertisements] = useState<IAdvertisement[]>([]);
  const [announcementId, setAnnouncementId] = useState<string | null>(null);

  const [isAdmin, setAdmin] = useState(false);
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [username, setUsername] = useState("");

  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    ws.current = new WebSocket(config.WS_URL + "announcements/");
    ws.current.onopen = () => {
      setStatus("Connected");
      console.log("Connected to WebSocket server");
    };
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Received data:", data); // Log data to confirm structure
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

  const handleIncomingMessage = (message: DataFromServer) => {
    console.log("Received data:", message); // Log data to confirm structure
    if (message.type === "initialdata") {
      setAnnouncements(message.data.announcements);
      setAdvertisements(message.data.advertisements);
      setAnnouncementId(message.data.newAnnouncmentId); // Use data.announcmentId as sent from backend
    }
    if (message.type === "advertisementadd") {
      setAdvertisements((prev) => [...prev, message.data.advertisement]);
    }
    if (message.type === "advertisementdelete") {
      setAdvertisements((prev) =>
        prev.filter((advertisement) => advertisement.id !== message.data.id)
      );
    }
    if (message.type === "announcementadd") {
      const newAnnouncements = message.data.announcement;
      setAnnouncements((prev) => {
        return Array.isArray(newAnnouncements)
          ? [...prev, ...newAnnouncements]
          : [...prev, newAnnouncements];
      });
    }
    if (message.type === "announcementdelete") {
      setAnnouncements((prev) =>
        prev.filter((announcement) => announcement.id !== message.data.id)
      );
    }
    if (message.type === "newannouncementid") {
      setAnnouncementId(message.data.id);
    }
  };

  const handleAddAnnouncement = async (newAnnouncement: Omit<IAnnouncement, "id">) => {
    console.log("Using announcementId:", announcementId); // Log announcementId to confirm it's correct
    try {
      const initResponse = await fetch(`${config.HOST}new/${announcementId}/`);
      if (initResponse.ok) {
        const response = await fetch(
          `${config.HOST}api/announcements/add/${announcementId}`,
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
      <h1 className="custom-header text-center mb-4">Ilmoitustaulu</h1>
      <Row className="mb-4">
        <Col md={4}>
          <AdvertisementGrid advertisements={advertisements} />
        </Col>
        <Col md={8}>
          <CustomCarousel
            announcements={filterAnnouncementsByCategory("myynti-ilmoitus")}
            itemsPerSlide={8}
            isAdmin={isAdmin}
            onDelete={(id) => console.log(`Delete announcement with id: ${id}`)}
          />
        </Col>
      </Row>
      <Row>
        <Col md={4} className="d-flex flex-column align-items-center justify-content-center">
          <div className="d-flex align-items-center">
            <p className="qr-text arrow-text text-center mr-3" style={{ width: 150 }}>
              Lisää oma ilmoituksesi skannaamalla QR-koodi
            </p>
            <QRCodeSVG value={`${config.HOST}new/${announcementId}/`} size={150} className="ml-3" />
          </div>
        </Col>
        <Col md={8}>
          <CustomCarousel
            announcements={filterAnnouncementsByCategory("asiakastoive")}
            itemsPerSlide={4}
            isAdmin={isAdmin}
            onDelete={(id) => console.log(`Delete announcement with id: ${id}`)}
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
          <Modal.Title>Lisää uusi ilmoitus</Modal.Title>
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
      <Modal show={isAdModalOpen} onHide={() => setIsAdModalOpen(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Lisää uusi mainos</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddAdvertisementForm
            onAddAdvertisement={(newAdvertisement) => {
              handleAddAdvertisement(newAdvertisement);
              setIsAdModalOpen(false);
            }}
          />
        </Modal.Body>
      </Modal>
    </Container>
  );
}
