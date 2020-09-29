import styled, { css } from 'styled-components';

interface UnitSpanProps {
  isSelected: boolean;
}

export const Container = styled.div`
  height: 90vh;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin: auto;
  flex-wrap: wrap;
  flex: 1;
`;

export const RecipeContainer = styled.div`
  border: 1px solid gray;
  padding: 16px;
  flex-basis: 50%;

  white-space: pre-wrap;
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
