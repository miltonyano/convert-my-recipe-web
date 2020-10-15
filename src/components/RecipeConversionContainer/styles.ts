import styled, { css } from 'styled-components';
import { shade } from 'polished';

interface UnitSpanProps {
  isSelected: boolean;
}

export const Container = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
`;

export const RecipeContainer = styled.div`
  border: 1px solid #232129;
  border-radius: 10px;
  padding: 16px;
  height: fit-content;
`;

export const ParsedRecipeContainer = styled.div`
  border-radius: 10px;
  padding: 8px 4px 8px 16px;
  border: 1px solid #232129;
  height: 50vh;
  white-space: pre-wrap;

  div {
    height: fill-available;
    overflow: auto;

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

export const UnitSpan = styled.span<UnitSpanProps>`
  ${props =>
    props.isSelected &&
    css`
      background-color: #ffff00;
    `}
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

export const CheckboxTreeContainer = styled.div`
  margin-top: 32px;
`;
