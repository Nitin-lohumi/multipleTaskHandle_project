import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
} from "@mui/material";
import RecipeModal from "./RecipeModal";
import { ClipLoader } from "react-spinners";

interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

const RecipeIdeas: React.FC = () => {
  const [ingredient, setIngredient] = useState<string>("chicken");
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);

  const fetchMeals = async (query: string) => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(
          query
        )}`
      );
      const data = await res.json();
      if (!data.meals) throw new Error("No meals found!");
      setMeals(data.meals.slice(0, 20));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals("chicken");
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ingredient.trim()) fetchMeals(ingredient);
  };

  return (
    <div>
      <Typography
        variant="h4"
        className="mb-6 text-orange-700 font-bold text-center"
      >
        🍲 Recipe Ideas
      </Typography>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-6 ">
        <TextField
          label="Enter ingredient (e.g., chicken, tomato)"
          variant="outlined"
          value={ingredient}
          onChange={(e) => setIngredient(e.target.value)}
          className=" w-full! mt-4!"
        />
        <Button type="submit" variant="contained" color="warning">
          Search
        </Button>
      </form>

      {loading && (
        <div className="flex justify-center">
          <ClipLoader />
        </div>
      )}
      {error && <Typography color="error">{error}</Typography>}

      <Grid container spacing={3} justifyContent="center">
        {meals.map((meal) => (
          <Grid key={meal.idMeal}>
            <Card
              onClick={() => setSelectedMeal(meal.idMeal)}
              sx={{
                width: 250,
                cursor: "pointer",
                boxShadow: 4,
                "&:hover": { boxShadow: 8, transform: "scale(1.02)" },
                transition: "all 0.3s ease",
              }}
            >
              <CardContent sx={{ textAlign: "center" }}>
                <img
                  src={meal.strMealThumb}
                  alt={meal.strMeal}
                  className="rounded-lg w-full h-40 object-cover"
                />
                <Typography variant="h6" sx={{ mt: 1 }}>
                  {meal.strMeal}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {selectedMeal && (
        <RecipeModal
          open={!!selectedMeal}
          onClose={() => setSelectedMeal(null)}
          mealId={selectedMeal}
        />
      )}
    </div>
  );
};

export default RecipeIdeas;
