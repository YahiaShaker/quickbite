import styled from "styled-components";

const OrangeButton = styled.button`
  width: 100%;
  border: 0;
  border-radius: 13px;
  background: var(--orange);
  color: white;
  font-weight: 700;
  font-size: 20px;
  line-height: 23px;
  padding: 0 18px;
  box-shadow: 0 5px 10px rgba(249, 101, 23, 0.18);
  transition: transform 160ms ease, box-shadow 160ms ease, background 160ms ease;

  &:hover {
    background: var(--orange-dark);
    transform: translateY(-2px);
    box-shadow: 0 8px 15px rgba(249, 101, 23, 0.28);
  }

  &:active {
    transform: translateY(0) scale(0.99);
    box-shadow: 0 3px 7px rgba(249, 101, 23, 0.22);
  }

  &:focus-visible {
    outline: 3px solid rgba(249, 101, 23, 0.3);
    outline-offset: 3px;
  }
`;

export default OrangeButton;
