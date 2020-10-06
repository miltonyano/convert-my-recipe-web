import styled, { css } from 'styled-components';

interface UnitSpanProps {
  isSelected: boolean;
}

export const Container = styled.div``;

export const Content = styled.div`
  height: 95vh;
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

export const SideAds = styled.div`
  margin: 0 96px;
`;
