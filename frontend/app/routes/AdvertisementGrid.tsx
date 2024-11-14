import React from "react";
import { Carousel } from "react-bootstrap";

import { Row, Col, Card } from "react-bootstrap";

import { IAdvertisement } from "../../interfaces";
import "bootstrap/dist/css/bootstrap.min.css";
import "../custom.css";

interface AdvertisementGridProps {
  advertisements: IAdvertisement[] | { id: number; file: string }[];
}

const demoAdvertisements = [
  { id: 1, file: "juusto.jpg" },
  { id: 2, file: "liha.jpg" },
  { id: 3, file: "makarooni.jpg" },
  { id: 4, file: "makkara.jpg" },
  { id: 5, file: "leipa.jpg" },
  // Add more advertisements as needed
];

export default function AdvertisementGrid({ advertisements }: AdvertisementGridProps) {
  return (
    <div>
      <Carousel interval={3000} controls={false} indicators={false}>
        {advertisements.slice(0, 16).map((ad, index) => (
          <Carousel.Item key={ad.id}>
            <img
              className="d-block w-100 carousel-image"
              src={`/adds/${ad.file}`}
              alt={`Advertisement ${index + 1}`}
            />
            <Carousel.Caption>
              <p>tekstiä</p>
            </Carousel.Caption>
          </Carousel.Item>

          /* <Col key={ad.id} xs={6} sm={4} md={3} className="mb-3">
            <Card>
              <Card.Img
                variant="top"
                src={`data:image/jpeg;base64,${ad.file}`}
                alt={`Advertisement ${index + 1}`}
              />
              <Card.Body>
                <Card.Text>tekstiä</Card.Text>
              </Card.Body>
            </Card>
          </Col> */
        ))}
      </Carousel>
    </div>
  );
}
