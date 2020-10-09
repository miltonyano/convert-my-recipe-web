import React, { createContext, useCallback, useState, useContext } from 'react';
import { differenceInMinutes, format } from 'date-fns';
import { parseISO } from 'date-fns/esm';
import { sanitize } from 'dompurify';

import api from '../services/api';

interface UnitList {
  value: number;
  unitText: string;
  term: string;
  id: string;
  to?: string;
  convertedValue?: number;
}

interface UnitGroup {
  name: string;
  type: string;
  unitList: UnitList[];
  conversion: string[];
}

interface Recipe {
  text: string;
  parsed?: string;
  unitGroup?: UnitGroup[];
}

interface RecipeState {
  recipe: Recipe;
  date: string;
}

interface RecipeContextData {
  getRecipe(): Recipe;
  parseRecipe(recipe: string): Promise<boolean>;
  convertRecipe(unitGroupToConvert: UnitGroup[]): Promise<void>;
  restart(): void;
}

const sanitizeRecipe = (recipe: Recipe) => {
  if (!recipe.parsed) {
    return recipe;
  }

  const parsedRecipeSanitized = sanitize(recipe.parsed, {
    ALLOWED_TAGS: ['span'],
    ALLOWED_ATTR: ['class', 'id'],
  });

  return { ...recipe, parsed: parsedRecipeSanitized };
};

const RecipeContext = createContext<RecipeContextData>({} as RecipeContextData);
const cacheTimeoutMinutes = 30;

export const RecipeProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<RecipeState>(() => {
    const recipe = localStorage.getItem('@ConvertMyRecipe:recipe');
    const date = localStorage.getItem('@ConvertMyRecipe:date');

    return recipe && date
      ? { date, recipe: sanitizeRecipe(JSON.parse(recipe)) }
      : ({} as RecipeState);
  });

  const getRecipe = useCallback(() => {
    if (!data) {
      return {} as Recipe;
    }

    const now = new Date();
    if (differenceInMinutes(now, parseISO(data.date)) > cacheTimeoutMinutes) {
      setData({} as RecipeState);
      return {} as Recipe;
    }

    return data.recipe;
  }, [data]);

  const parseRecipe = useCallback(async (recipeText: string) => {
    const response = await api.post('/recipe/parse', {
      recipeText,
    });

    const { unitGroup, parsedRecipe } = response.data;

    if (!unitGroup.length) {
      return false;
    }

    const recipe: Recipe = {
      text: recipeText,
      parsed: parsedRecipe,
      unitGroup,
    };

    const date = format(new Date(), 'yyyy-MM-dd');

    localStorage.setItem('@ConvertMyRecipe:recipe', JSON.stringify(recipe));
    localStorage.setItem('@ConvertMyRecipe:date', date);

    setData({ recipe, date });

    return true;
  }, []);

  const convertRecipe = useCallback(
    async (unitGroupToConvert: UnitGroup[]) => {
      const response = await api.post('/recipe/convert', {
        unitGroup: unitGroupToConvert,
        parsedRecipe: data.recipe.parsed,
      });

      const recipe: Recipe = {
        text: response.data.recipe,
      };

      const date = format(new Date(), 'yyyy-MM-dd');

      localStorage.setItem('@ConvertMyRecipe:recipe', JSON.stringify(recipe));
      localStorage.setItem('@ConvertMyRecipe:date', date);

      setData({ recipe, date });
    },
    [data],
  );

  const restart = useCallback(() => {
    localStorage.removeItem('@ConvertMyRecipe:recipe');
    localStorage.removeItem('@ConvertMyRecipe:date');

    setData({} as RecipeState);
  }, []);

  return (
    <RecipeContext.Provider
      value={{ getRecipe, parseRecipe, convertRecipe, restart }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export function useRecipe(): RecipeContextData {
  const context = useContext(RecipeContext);

  return context;
}
