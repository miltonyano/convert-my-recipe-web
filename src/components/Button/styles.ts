import styled, { css } from 'styled-components';
import { shade } from 'polished';

export const Container = styled.button`
  background: #ff9000;
  height: 56px;
  border-radius: 10px;
  border: 0;
  padding: 0 16px;
  width: 100%;
  color: #312e38;
  font-weight: 500;
  margin-top: 16px;
  transition: background-color 0.2s;

  &:hover {
    background: ${shade(0.2, '#FF9000')};
  }

  ${props =>
    props.disabled &&
    css`
      background: #6c757d;
      cursor: not-allowed;

      &:hover {
        background: #6c757d;
      }
    `}
`;
