import styled from "styled-components"

export const Title = styled.h1`
  &.Title_Register,
  &.Title_Login {
    font-size: 3em;
    margin-bottom: 1rem;
    letter-spacing: 2px;
    color: ${(props) => props.theme.colors.primary};

    &.Minor {
      font-size: 1.4em;
      color: ${(props) => props.theme.shades.lighter};
    }

    @media only screen and (max-width: 400px) {
      font-size: 2em;

      &.Minor {
        font-size: 1.6em;
      }
    }
  }
`

export const SubTitle = styled.h2`
  &.Card_Header_Title {
    font-size: 2em;
    text-align: center;
  }
`
