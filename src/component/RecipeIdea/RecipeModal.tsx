import React, { useEffect, useState } from "react";
import { Modal, Box, Typography } from "@mui/material";

interface RecipeModalProps {
  open: boolean;
  onClose: () => void;
  mealId: string;
}

interface MealDetails {
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strYoutube?: string;
}

const RecipeModal: React.FC<RecipeModalProps> = ({ open, onClose, mealId }) => {
  const [mealDetails, setMealDetails] = useState<MealDetails | null>(null);

  useEffect(() => {
    if (!mealId) return;
    const fetchMealDetails = async () => {
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
      );
      const data = await res.json();
      setMealDetails(data.meals[0]);
    };

    fetchMealDetails();
  }, [mealId]);

  if (!mealDetails) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute" as const,
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "white",
          p: 4,
          borderRadius: 3,
          boxShadow: 24,
          maxHeight: "80vh",
          overflowY: "auto",
        }}
      >
        <Typography variant="h6" gutterBottom>
          {mealDetails.strMeal}
        </Typography>
        <img
          src={mealDetails.strMealThumb}
          alt={mealDetails.strMeal}
          className="rounded-lg w-40 h-50 m-auto p-1"
        />
        <Typography className="p-2">
          <b>Category:</b> {mealDetails.strCategory}
        </Typography>
        <Typography className="p-2">
          <b>Area:</b> {mealDetails.strArea}
        </Typography>
        <Typography sx={{ mt: 2, mb: 2 }}>
          {mealDetails.strInstructions}
        </Typography>
        {mealDetails.strYoutube && (
          <a
            href={mealDetails.strYoutube}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            ▶️ Watch on YouTube
          </a>
        )}
      </Box>
    </Modal>
  );
};

export default RecipeModal;
