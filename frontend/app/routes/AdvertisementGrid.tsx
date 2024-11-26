import React from "react";
import { Carousel } from "react-bootstrap";

import { Row, Col, Card, Button } from "react-bootstrap";

import { IAdvertisement } from "../../interfaces";
import "bootstrap/dist/css/bootstrap.min.css";
import "../custom.css";

interface AdvertisementGridProps {
  advertisements: IAdvertisement[] | { id: number; file: string }[];
  isAdmin?: boolean;
  onDelete?: (id: number) => void;
}

export default function AdvertisementGrid({
  advertisements,
  isAdmin = false,
  onDelete,
}: AdvertisementGridProps) {
  return (
    <div>
      {isAdmin ? (
        // Admin view Grid
        <div className="d-flex flex-wrap" style={{ gap: "15px", justifyContent: "space-between" }}>
          {advertisements.map((ad) => (
            <Card
              key={ad.id}
              className="p-3 shadow-sm"
              style={{
                flex: "0 0 calc(50% - 15px)",
                borderRadius: "10px",
                position: "relative",
              }}
            >
              <Card.Img
                variant="top"
                src={ad.file}
                alt="Advertisement"
                style={{ height: "150px", objectFit: "cover" }}
              />
              {onDelete && (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    console.log("Delete button clicked for ad ID:", ad.id);
                    onDelete(ad.id);
                  }}
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    borderRadius: "5px",
                  }}
                >
                  Poista
                </Button>
              )}
            </Card>
          ))}
        </div>
      ) : (
        // Non-admin view Carousel
        <Carousel interval={3000} controls={false} indicators={false}>
          {advertisements.map((ad, index) => (
            <Carousel.Item key={ad.id}>
              <img
                className="d-block w-100 carousel-image"
                src={ad.file}
                alt={`Advertisement ${index + 1}`}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      )}
    </div>
  );
}
