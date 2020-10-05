import styled from 'styled-components';

export const Container = styled.div``;

export const Content = styled.div`
  height: 90vh;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: auto;
  flex-wrap: wrap;
`;

export const RecipeContainer = styled.div`
  border: 1px solid gray;
  padding: 16px;
  flex-basis: 50%;

  white-space: pre-wrap;
`;

export const ConvertedRecipeContainer = styled.div`
  border-radius: 10px;
  padding: 8px 0 8px 16px;
  width: 100%;
  border: 1px solid #232129;
  height: 40vh;
  white-space: pre-wrap;

  div {
    height: fill-available;
    overflow: auto;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
`;

export const SideAds = styled.div`
  margin: 0 96px;
`;
