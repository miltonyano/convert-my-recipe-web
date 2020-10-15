import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div``;

export const Content = styled.div`
  display: flex;
  justify-content: center;
  padding: 32px;
`;

export const RecipeContainer = styled.div`
  border: 1px solid #232129;
  border-radius: 10px;
  padding: 16px;
`;

export const ConvertedRecipeContainer = styled.div`
  border-radius: 10px;
  border: 1px solid #232129;
  padding: 8px 4px 8px 16px;
  height: 50vh;
  white-space: pre-wrap;

  div {
    height: fill-available;
    overflow: auto;

    transition: background-color 0.2s;

    ::-webkit-scrollbar {
      width: 8px;
    }

    ::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: ${shade(0.2, '#c1c1c1')};
    }
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;
