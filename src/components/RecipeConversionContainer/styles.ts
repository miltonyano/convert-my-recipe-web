import styled, { css } from 'styled-components';

interface UnitSpanProps {
  isSelected: boolean;
}

export const Container = styled.div`
  height: 95vh;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin: auto;
  flex-wrap: wrap;
  flex: 1;
  padding: 32px;
`;

export const RecipeContainer = styled.div`
  border: 1px solid gray;
  padding: 16px;
  flex-basis: 50%;
`;

export const ParsedRecipeContainer = styled.div`
  border-radius: 10px;
  padding: 8px 0 8px 16px;
  width: 100%;
  border: 1px solid #232129;
  height: 50vh;
  white-space: pre-wrap;

  div {
    height: fill-available;
    overflow: auto;
  }
`;

export const UnitSpan = styled.span<UnitSpanProps>`
  ${props =>
    props.isSelected &&
    css`
      background-color: #ffff00;
    `}
`;

export const ButtonContainer = styled.div`
  display: flex;
`;

export const CheckboxTreeContainer = styled.div`
  flex: unset;
`;
