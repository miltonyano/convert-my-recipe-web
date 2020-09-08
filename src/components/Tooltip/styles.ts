import styled from 'styled-components';

export const Container = styled.div`
  position: relative;

  span {
    background: #ff9000;
    color: #312e38;
    text-align: center;
    font-size: 14px;
    font-weight: 500;
    width: 180px;
    padding: 8px;
    border-radius: 4px;
    opacity: 0;
    transition: opacity 0.4s linear;
    visibility: hidden;

    position: absolute;
    bottom: calc(100% + 12px);
    margin-left: 10px;
    transform: translateX(-50%);

    &::before {
      content: '';
      border-style: solid;
      border-color: #ff9000 transparent;
      border-width: 6px 6px 0 6px;

      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: 100%;
    }
  }

  &:hover span {
    visibility: visible;
    opacity: 0.85;
  }
`;
