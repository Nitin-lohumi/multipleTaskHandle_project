import React, { useEffect, useState } from "react";
import { Modal, Box, Typography, IconButton } from "@mui/material";
interface BookDetail {
  title: string;
  description?: string | { value: string };
  subjects?: string[];
  covers?: number[];
}

interface Props {
  workKey: string;
  open: boolean;
  onClose: () => void;
}

const BookModal: React.FC<Props> = ({ workKey, open, onClose }) => {
  const [book, setBook] = useState<BookDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!workKey) return;
    const fetchDetails = async () => {
      try {
        const res = await fetch(`https://openlibrary.org${workKey}.json`);
        const data = await res.json();
        setBook(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [workKey]);

  const cleanDescription = (desc: string) => {
    if (!desc) return "No description available.";
    let clean = desc.replace(/\[.*?\]\(.*?\)/g, "");
    clean = clean.replace(/\s+/g, " ").trim();
    const subjectIndex = clean.toLowerCase().indexOf("subjects:");
    if (subjectIndex !== -1) {
      clean = clean.substring(0, subjectIndex).trim();
    }
    return clean;
  };

  const extractSubjects = (desc?: string) => {
    if (!desc) return [];
    const match = desc.match(/Subjects:(.*)/i);
    if (!match) return [];
    return match[1]
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  };

  const descriptionText =
    typeof book?.description === "string"
      ? book.description
      : book?.description?.value || "";

  const subjectsFromDesc = extractSubjects(descriptionText);
  const finalDescription = cleanDescription(descriptionText);

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute" as const,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          borderRadius: 3,
          boxShadow: 24,
          p: 4,
          width: "90%",
          maxWidth: 600,
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", top: 8, right: 8, color: "gray" }}
        >
          X
        </IconButton>

        {loading ? (
          <Typography textAlign="center">Loading...</Typography>
        ) : !book ? (
          <Typography textAlign="center">No details found.</Typography>
        ) : (
          <>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {book.title}
            </Typography>

            {book.covers && (
              <img
                src={`https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg`}
                alt={book.title}
                loading="eager"
                style={{
                  width: 160,
                  height: 160,
                  borderRadius: 8,
                  objectFit: "cover",
                  display: "block",
                  margin: "0 auto 16px auto",
                }}
              />
            )}

            <Typography variant="body2" color="text.secondary" paragraph>
              {finalDescription}
            </Typography>

            {subjectsFromDesc.length > 0 && (
              <Box mt={2}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Subjects:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {subjectsFromDesc.slice(0, 8).join(", ")}
                </Typography>
              </Box>
            )}
          </>
        )}
      </Box>
    </Modal>
  );
};

export default BookModal;
